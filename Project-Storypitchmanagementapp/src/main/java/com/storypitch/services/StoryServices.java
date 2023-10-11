package com.storypitch.services;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.storypitch.models.Author;
import com.storypitch.models.Editor;
import com.storypitch.models.Story;
import com.storypitch.repositories.StoryRepo;

public class StoryServices {
	private static StoryServices instance;
	private StoryRepo repo = new StoryRepo();
	private static Logger logger = LogManager.getLogger(StoryServices.class);
	
	private StoryServices() {}
	
	public static StoryServices getInstance() {
		if (instance == null) instance = new StoryServices();
		return instance;
	}
	
//	public Story parse(Gson gson, BufferedReader reader) throws IOException {
//		return gson.fromJson(reader, Story.class);
//	}
	
	public void submitNextWaitingProposal(Author a) {
		List<Story> waiting = this.getAllWaitingForAuthor(a);
		Story next = waiting.stream().filter((s) -> { return s.getType().getPoints() <= a.getPoints(); }).findAny().orElse(null);
		logger.info("Submitting waiting proposal " + next + " for " + a);
		if (next != null) {
			this.incrementApprovalStatus(next, null);
			AuthorServices.getInstance().subtractPoints(a, next.getType().getPoints());
			this.updateStory(next);
		}
	}
	
	public Story addStory(Story s) {
		logger.info("Adding " + s);
		return this.repo.add(s);
	}
	
	public List<Story> getAllByAuthor(Integer a) {
		return this.repo.getAllByAuthor(a);
	}
	
	public List<Story> getAllByGenreAndStatus(Integer genre, String status) {
		return this.repo.getAllByGenreAndStatus(genre, status);
	}
	
	public List<Story> getAllByReceiverName(String firstName, String lastName) {
		return this.repo.getAllByReceiverName(firstName, lastName);
	}
	
	public List<Story> getAllWithDraftsForEditor(Editor e) {
		// TODO: refactor this method so that most of the logic is in here instead of in the repo,
		// TODO: and split the sql queries into individual methods in the repo
		return this.repo.getAllWithDraftsForEditor(e);
	}
	
	public List<Story> getAllWaitingForAuthor(Author a) {
		return this.repo.getAllByAuthorAndStatus(a.getId(), "waiting");
	}
	
	public void updateStory(Story s) {
		logger.info("Updating " + s);
		this.repo.update(s);
	}
	
	public void incrementApprovalStatus(Story s, Editor e) {
		String status = s.getApprovalStatus();
		switch (status) {
			case "waiting":
				s.setApprovalStatus("submitted");
				break;
			case "submitted":
				s.setApprovalStatus("approved_assistant");
				s.setAssistant(e);
				break;
			case "approved_assistant":
				s.setApprovalStatus("approved_editor");
				s.setEditor(e);
				break;
			case "approved_editor":
				s.setApprovalStatus("approved_senior");
				s.setSenior(e);
				break;
			case "approved_senior":
				s.setApprovalStatus("draft_approved");
				break;
			default: break;
		}
		logger.info("Incremented approval status for " + s);
		this.updateStory(s);
	}
	
	public boolean deleteStory(Story s) {
		AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
		logger.info("Deleting " + s);
		return this.repo.delete(s);
	}
}
