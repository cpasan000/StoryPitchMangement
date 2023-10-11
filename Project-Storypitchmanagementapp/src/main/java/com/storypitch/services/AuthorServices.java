package com.storypitch.services;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.revature.models.Author;
import com.revature.repositories.AuthorRepo;

public class AuthorServices {
	private static AuthorServices instance;
	private AuthorRepo repo = new AuthorRepo();
	private static Logger logger = LogManager.getLogger(AuthorServices.class);
	
	private AuthorServices() {}
	
	public static AuthorServices getInstance() {
		if (instance == null) instance = new AuthorServices();
		return instance;
	}
	
	public Author addAuthor(Author a) {
		logger.info("Adding " + a);
		return this.repo.add(a);
	}
	
	public Author getByUsernameAndPassword(String username, String password) {
		logger.info(String.format("Getting Author with credentials: username=%s, password=%s", username, password));
		return this.repo.getByUsernameAndPassword(username, password);
	}
	
	public void updateAuthor(Author a) {
		logger.info("Updating " + a);
		this.repo.update(a);
	}
	
	public void addPoints(Author a, int points) {
		logger.info("Adding " + points + " to " + a);
		a.setPoints(a.getPoints() + points);
		this.updateAuthor(a);
	}
	
	public void subtractPoints(Author a, int points) {
		logger.info("Subtracting " + points + " from " + a);
		a.setPoints(a.getPoints() - points);
		this.updateAuthor(a);
	}
	
	public boolean deleteAuthor(Author a) {
		logger.info("Deleting " + a);
		return this.repo.delete(a);
	}
}
