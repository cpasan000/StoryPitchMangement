package com.storypitch.services;

import java.util.ArrayList;
import java.util.List;

import com.storypitch.models.StoryType;
import com.storypitch.repositories.StoryTypeRepo;

public class StoryTypeServices {
	private static StoryTypeServices instance;
	private StoryTypeRepo repo = new StoryTypeRepo();
	
	private StoryTypeServices() {}
	
	public static StoryTypeServices getInstance() {
		if (instance == null) instance = new StoryTypeServices();
		return instance;
	}
	
	public List<StoryType> getAllList() {
		return new ArrayList<StoryType>(this.repo.getAll().values());
	}
}
