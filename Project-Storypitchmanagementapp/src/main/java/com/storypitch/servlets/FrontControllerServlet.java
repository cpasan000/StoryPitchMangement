package com.storypitch.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.storypitch.models.Author;
import com.storypitch.models.Editor;
import com.storypitch.models.Genre;
import com.storypitch.models.Story;
import com.storypitch.models.StoryType;
import com.storypitch.services.AuthorServices;
import com.storypitch.services.EditorServices;
import com.storypitch.services.GEJoinServices;
import com.storypitch.services.GenreServices;
import com.storypitch.services.StoryServices;
import com.storypitch.services.StoryTypeServices;

public class FrontControllerServlet extends HttpServlet {
	class LoginInfo {
		public String username;
		public String password;
	}
	
	public FrontControllerServlet() {
		GEJoinServices.loadEntries();
	}
	
	private Gson gson = new Gson();
	public static HttpSession session;
	public static Logger logger = LogManager.getLogger(FrontControllerServlet.class);
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(Story.class, new Story.Deserializer());
		gsonBuilder.setDateFormat("yyyy-MM-dd");
		this.gson = gsonBuilder.create();
		
		String uri = request.getRequestURI();
		System.out.println(uri);
		String json = "";
		
		response.setHeader("Access-Control-Allow-Origin", "*");		// Needed to avoid CORS violations
		response.setHeader("Content-Type", "application/json");		// Needed to enable json data to be passed between front and back end

		session = request.getSession();
		
		uri = uri.substring("/Project_1/controller/".length());
		switch (uri) {
			case "sign_up_author": {
				System.out.println("Received author sign up!");
				Author a = this.gson.fromJson(request.getReader(), Author.class);
				if (a != null) {
					a = AuthorServices.getInstance().addAuthor(a);
					System.out.println("Created new Author " + a + " and logged in!");
					logger.info("Created new Author " + a + " and logged in!");
					session.setAttribute("logged_in", a);
					response.getWriter().append("author_main.html");
				} else {
					System.out.println("Failed to create new Author account!");
				}
				break;
			}
			// TODO: can editor login and author login be combined into the same thing? would require that login info across the two tables be unique
			case "author_login": {
				System.out.println("Received author_login!");
				LoginInfo info = this.gson.fromJson(request.getReader(), LoginInfo.class);
				Author a = AuthorServices.getInstance().getByUsernameAndPassword(info.username, info.password);
				if (a != null) {
					System.out.println("Author " + a.getFirstName() + " has logged in!");
					logger.info("Author " + a + " has logged in!");
					session.setAttribute("logged_in", a);
					response.getWriter().append("author_main.html");
				} else {
					System.out.println("Failed to login with credentials: username=" + info.username + " password=" + info.password);
					logger.error("Failed to login as an Author with credentials: username=" + info.username + " password=" + info.password);
				}
				break;
			}
			case "editor_login": {
				System.out.println("Recieved editor_login!");
				LoginInfo info = this.gson.fromJson(request.getReader(), LoginInfo.class);
				Editor e = EditorServices.getInstance().getByUsernameAndPassword(info.username, info.password);
				if (e != null) {
					System.out.println("Editor " + e.getFirstName() + " has logged in!");
					logger.info("Editor " + e + " has logged in!");
					session.setAttribute("logged_in", e);
					response.getWriter().append("editor_main.html");
				} else {
					System.out.println("Failed to login with credentials: username=" + info.username + " password=" + info.password);
					logger.error("Failed to login as an Editor with credentials: username=" + info.username + " password=" + info.password);
				}
				break;
			}
			case "logout": {
				String pageURL = "";
				Object loggedIn = session.getAttribute("logged_in");
				if (loggedIn instanceof Author) pageURL = "index.html";
				if (loggedIn instanceof Editor) pageURL = "login_editors.html";
				System.out.println("Logging out!");
				logger.info("User " + loggedIn + " has logged out.");
				response.getWriter().append(pageURL);
				session.invalidate();
				break;
			}
			case "get_story_types": {
				List<StoryType> types = StoryTypeServices.getInstance().getAllList();
				List<Genre> genres = GenreServices.getInstance().getAllList();
				Author a = (Author) session.getAttribute("logged_in");
				String[] jsons = new String[] { this.gson.toJson(types), this.gson.toJson(genres), this.gson.toJson(a) };
				json = this.gson.toJson(jsons);
				response.getWriter().append(json);
				break;
			}
			case "submit_story_form": {
				Story story = this.gson.fromJson(request.getReader(), Story.class);
				Author a = (Author) session.getAttribute("logged_in");
				if (a.getPoints() < story.getType().getPoints()) {
					story.setApprovalStatus("waiting");
				} else {
					story.setApprovalStatus("submitted");
					AuthorServices.getInstance().subtractPoints(a, story.getType().getPoints());
				}
				story.setAuthor(a);
				story.setModified(false);
				story.setDraftApprovalCount(0);
				story = StoryServices.getInstance().addStory(story);
				System.out.println(story);
				logger.info(a + " added new proposal for " + story);
				break;
			}
			case "get_proposals": {
				Object logged_in = session.getAttribute("logged_in");
				if (logged_in instanceof Author) {
					Author a = (Author) logged_in;
					List<Story> stories = StoryServices.getInstance().getAllByAuthor(a.getId());
					json = "author|" + this.gson.toJson(stories);
					response.getWriter().append(json);
				} else if (logged_in instanceof Editor) {
					Editor e = (Editor) session.getAttribute("logged_in");
					Set<Genre> genres = GEJoinServices.getGenres(e);
					List<Story> stories = new ArrayList<Story>();
					
					for (Genre g : genres) {
						if (e.getSenior()) {
							stories.addAll(StoryServices.getInstance().getAllByGenreAndStatus(g.getId(), "approved_editor"));
						} else if (e.getAssistant()) {
							stories.addAll(StoryServices.getInstance().getAllByGenreAndStatus(g.getId(), "submitted"));
						} else {
							Genre other = GenreServices.getInstance().getGenreForGeneralEditor(g);
							stories.addAll(StoryServices.getInstance().getAllByGenreAndStatus(other.getId(), "approved_assistant"));
						}
					}
					
					String flag = "general|";
					if (e.getAssistant()) flag = "assistant|";
					else if (e.getSenior()) flag = "senior|";
					json = flag + this.gson.toJson(stories);
					
					response.getWriter().append(json);
				}
				break;
			}
			case "save_story_to_session": {
				JsonElement root = JsonParser.parseReader(request.getReader());
				session.setAttribute("story", root.getAsJsonObject());
				response.getWriter().append("saved");
				break;
			}
			case "get_story_from_session": {
				JsonObject sj = (JsonObject) session.getAttribute("story");
				String str = "";
				Object logged_in = session.getAttribute("logged_in");
				if (logged_in instanceof Author) {
					str = "author|";
				} else {
					str = "editor|";
				}
				response.getWriter().append(str + sj.toString());
				break;
			}
			case "approve_story": {
				Editor e = (Editor) session.getAttribute("logged_in");
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				StoryServices.getInstance().incrementApprovalStatus(s, e);
				break;
			}
			case "deny_story": {
				Object logged_in = session.getAttribute("logged_in");
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				
				if (logged_in instanceof Author) {
					Author a = (Author) logged_in;
					logger.info(a + " cancelled proposal for " + s);
//					StoryServices.getInstance().deleteStory(s);
					s.setApprovalStatus("cancelled");
					StoryServices.getInstance().updateStory(s);
					AuthorServices.getInstance().addPoints(a, s.getType().getPoints());
					StoryServices.getInstance().submitNextWaitingProposal(a);
				} else {
					Editor e = (Editor) logged_in;
					s.setApprovalStatus("denied");
					logger.info(e + " denied proposal for " + s);
					StoryServices.getInstance().updateStory(s);
					AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
					StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
				}
				
				response.getWriter().append(this.gson.toJson(s));
				break;
			}
			case "request_info": {
				String[] strs = this.gson.fromJson(request.getReader(), String[].class);
				Story s = this.gson.fromJson(strs[0], Story.class);
				String receiverName = this.gson.fromJson(strs[1], String.class);
				s.setReceiverName(receiverName);
				StoryServices.getInstance().updateStory(s);
//				System.out.println("Requesting info!!! " + s);
				logger.info(s.getRequestorName() + " requested more information from " + s.getReceiverName() + " for proposal " + s);
				break;
			}
			case "get_requests": {
				Object logged_in = session.getAttribute("logged_in");
				String[] receiverName = new String[2];
				
				if (logged_in instanceof Editor) {
					Editor e = (Editor) logged_in;
					receiverName[0] = e.getFirstName();
					receiverName[1] = e.getLastName();
				} else if (logged_in instanceof Author) {
					Author a = (Author) logged_in;
					receiverName[0] = a.getFirstName();
					receiverName[1] = a.getLastName();
				}
				
				List<Story> stories = StoryServices.getInstance().getAllByReceiverName(receiverName[0], receiverName[1]);
				if (logged_in instanceof Author) {
					json = "author|" + this.gson.toJson(stories);
				} else if (logged_in instanceof Editor) {
					json = "editor|" + this.gson.toJson(stories);
				}
				response.getWriter().append(json);
				break;
			}
			case "get_draft_requests": {
				Editor e = (Editor) session.getAttribute("logged_in");
				List<Story> stories = StoryServices.getInstance().getAllWithDraftsForEditor(e);
				json = this.gson.toJson(stories);
				response.getWriter().append(json);
				break;
			}
			case "save_response": {
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				StoryServices.getInstance().updateStory(s);
				break;
			}
			case "get_editor_main_labels": {
				String[] counts = new String[4];
				
				Editor e = (Editor) session.getAttribute("logged_in");
				if (e == null) System.out.println("get_editor_main_labels: editor null!!!!");
				Set<Genre> genres = GEJoinServices.getGenres(e);
				List<Story> stories = new ArrayList<Story>();
				
				for (Genre g : genres) {
					if (e.getSenior()) {
						stories.addAll(StoryServices.getInstance().getAllByGenreAndStatus(g.getId(), "approved_editor"));
					} else if (e.getAssistant()) {
						stories.addAll(StoryServices.getInstance().getAllByGenreAndStatus(g.getId(), "submitted"));
					} else {
						Genre genre = GenreServices.getInstance().getGenreForGeneralEditor(g);
						stories.addAll(StoryServices.getInstance().getAllByGenreAndStatus(genre.getId(), "approved_assistant"));
					}
				}
				
				List<Story> infoReqs = StoryServices.getInstance().getAllByReceiverName(e.getFirstName(), e.getLastName());
				List<Story> draftReqs = StoryServices.getInstance().getAllWithDraftsForEditor(e);
				
				counts[0] = e.getFirstName() + " " + e.getLastName();
				counts[1] = "" + stories.size();
				counts[2] = "" + infoReqs.size();
				counts[3] = "" + draftReqs.size();
				
				response.getWriter().append(this.gson.toJson(counts));
				
				break;
			}
			case "get_author_main_labels": {
				String[] counts = new String[4];
				Author a = (Author) session.getAttribute("logged_in");
				if (a == null) System.out.println("get_author_main_labels: author null!!!!");
				List<Story> stories = StoryServices.getInstance().getAllByAuthor(a.getId());
				List<Story> infoReqs = StoryServices.getInstance().getAllByReceiverName(a.getFirstName(), a.getLastName());
				counts[0] = a.getFirstName() + " " + a.getLastName();
				counts[1] = "" + stories.size();
				counts[2] = "" + infoReqs.size();
				counts[3] = "";
				
				response.getWriter().append(this.gson.toJson(counts));
				break;
			}
			case "update_details": {
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				StoryServices.getInstance().updateStory(s);
				break;
			}
			case "submit_draft": {
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				StoryServices.getInstance().updateStory(s);
				break;
			}
			case "update_draft": {
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				System.out.println("Updating draft: " + s.getTitle() + " d: " + s.getDraft());
				s.setRequest(null);
				s.setModified(false);
				StoryServices.getInstance().updateStory(s);
				break;
			}
			case "approve_draft": {
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				String type = s.getType().getName();
				System.out.println("Approving draft for type " + type);
				switch (type) {
					case "Novel":
					case "Novella": {
						Set<Editor> editors = GEJoinServices.getEditors(s.getGenre());
						Integer count = s.getDraftApprovalCount();
						count++;
						s.setDraftApprovalCount(count);
						float avg = (float) count / (float) editors.size();
						if (avg > 0.5f) {
							s.setApprovalStatus("Approved");
							logger.info("Proposal approved for " + s);
							AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
							StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
						}
						StoryServices.getInstance().updateStory(s);
						break;
					}
					case "Short Story": {
						Integer count = s.getDraftApprovalCount();
						count++;
						s.setDraftApprovalCount(count);
						if (count == 2) {
							s.setApprovalStatus("Approved");
							logger.info("Proposal approved for " + s);
							AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
							StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
						}
						StoryServices.getInstance().updateStory(s);
						break;
					}
					case "Article": {
						s.setApprovalStatus("Approved");
						s.setDraftApprovalCount(1);
						logger.info("Proposal approved for " + s);
						AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
						StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
						StoryServices.getInstance().updateStory(s);
						break;
					}
				}
				break;
			}
			case "deny_draft": {
				Story s = this.gson.fromJson(request.getReader(), Story.class);
//				StoryServices.getInstance().deleteStory(s);
				s.setApprovalStatus("denied");
				StoryServices.getInstance().updateStory(s);
				StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
				logger.info("Draft denied for proposal " + s);
				break;
			}
			case "request_draft_change": {
				Story s = this.gson.fromJson(request.getReader(), Story.class);
				StoryServices.getInstance().updateStory(s);
				logger.info("Draft changes requested for proposal " + s);
				break;
			}
			default: break;
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		doGet(request, response);
	}
}
