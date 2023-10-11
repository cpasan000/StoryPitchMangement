package com.storypitch.services;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.storypitch.models.Genre;
import com.storypitch.repositories.GenreRepo;

public class GenreServices {
	private static GenreServices instance;
	private GenreRepo repo = new GenreRepo();
	private static Logger logger = LogManager.getLogger(GenreServices.class);
	
	private GenreServices() {}
	
	public static GenreServices getInstance() {
		if (instance == null) instance = new GenreServices();
		return instance;
	}
	
	public List<Genre> getAllList() {
		return new ArrayList<Genre>(this.repo.getAll().values());
	}
	
	public Genre getByName(String name) {
		logger.info("Getting genre with name " + name);
		return this.repo.getByName(name);
	}

	public Genre getGenreForGeneralEditor(Genre g) {
		logger.info("Getting genre for general editor given " + g.getName());
		switch (g.getName()) {
			case "Sci-fi": return this.getByName("Fantasy");
			case "Fantasy": return this.getByName("Horror");
			case "Horror": return this.getByName("Sci-fi");
			default: return g;
		}
	}
}
