package com.storypitch.app;

import java.sql.Date;

import com.storypitch.models.Author;
import com.storypitch.models.Editor;
import com.storypitch.models.GEJoin;
import com.storypitch.models.Genre;
import com.storypitch.models.Story;
import com.storypitch.models.StoryType;
import com.storypitch.repositories.AuthorRepo;
import com.storypitch.repositories.EditorRepo;
import com.storypitch.repositories.GEJoinRepo;
import com.storypitch.repositories.GenreRepo;
import com.storypitch.repositories.StoryRepo;
import com.storypitch.repositories.StoryTypeRepo;
import com.storypitch.services.GEJoinServices;

public class TempDriver {
	private static AuthorRepo ar = new AuthorRepo();
	private static EditorRepo er = new EditorRepo();
	private static GenreRepo gr = new GenreRepo();
	private static StoryRepo sr = new StoryRepo();
	private static StoryTypeRepo str = new StoryTypeRepo();
	
	public static void main(String[] args) {
		Author a = new Author("Test", "Author", "He is a test author");
		ar.add(a);
		
		StoryType novel = str.getByName("novel");
		StoryType novella = str.getByName("novella");
		StoryType short_story = str.getByName("short story");
		StoryType article = str.getByName("article");
		
		Editor hisham = er.add(new Editor("Hisham", "Haqq", "hisham", "haqq"));
		Editor emmett = er.add(new Editor("Emmett", "Riddle", "emmett", "riddle"));
		Editor erika = er.add(new Editor("Erika", "Fomich", "erika", "fomich"));
		Editor bennett = er.add(new Editor("Bennett", "Kerbow", "bennett", "kerbow"));
		Editor sydney = er.add(new Editor("Sydney", "Porter", "sydney", "porter"));
		Editor jason = er.add(new Editor("Jason", "Weible", "jason", "weible"));
		
		Genre scifi = gr.add(new Genre("Sci-fi"));
		Genre fantasy = gr.add(new Genre("Fantasy"));
		Genre horror = gr.add(new Genre("Horror"));
		
		GEJoinServices.addEntry(scifi, hisham, true, false);
		GEJoinServices.addEntry(scifi, emmett, false, false);
		GEJoinServices.addEntry(scifi, erika, false, false);
		GEJoinServices.addEntry(scifi, bennett, false, true);
		
		GEJoinServices.addEntry(fantasy, emmett, true, false);
		GEJoinServices.addEntry(fantasy, erika, false, false);
		GEJoinServices.addEntry(fantasy, bennett, false, false);
		GEJoinServices.addEntry(fantasy, sydney, false, true);
		
		GEJoinServices.addEntry(horror, erika, true, false);
		GEJoinServices.addEntry(horror, bennett, false, false);
		GEJoinServices.addEntry(horror, sydney, false, false);
		GEJoinServices.addEntry(horror, jason, false, true);
		
		Story story = new Story();
		story.setTitle("Story Title");
		story.setGenre(fantasy);
		story.setType(short_story);
		story.setAuthor(a);
		story.setDescription("A short description!");
		story.setTagLine("Amazing Tag Line!");
		story.setCompletionDate(new Date(2021, 06, 14));
		story.setApprovalStatus("pending");
		story.setReason("");
		sr.add(story);
		
		GEJoinServices.loadEntries();
		GEJoin join = (new GEJoinRepo()).getById(5);
		System.out.println(join);
	}
}
