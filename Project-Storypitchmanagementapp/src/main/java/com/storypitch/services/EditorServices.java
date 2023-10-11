package com.storypitch.services;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.storypitch.models.Editor;
import com.storypitch.repositories.EditorRepo;

public class EditorServices {
	private static EditorServices instance;
	private EditorRepo repo = new EditorRepo();
	private static Logger logger = LogManager.getLogger(EditorServices.class);
	
	private EditorServices() {}
	
	public static EditorServices getInstance() {
		if (instance == null) instance = new EditorServices();
		return instance;
	}
	
	public Editor addEditor(Editor e) {
		logger.info("Adding " + e);
		return this.repo.add(e);
	}
	
	public Editor getByUsernameAndPassword(String username, String password) {
		logger.info(String.format("Getting Editor with credentials: username=%s, password=%s", username, password));
		return this.repo.getByUsernameAndPassword(username, password);
	}
}
