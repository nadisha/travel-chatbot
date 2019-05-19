package org.travel.ontology.service;

import java.util.List;

import org.travel.ontology.domain.Destination;

public interface DestinationService {
	List<Destination> getByCity(String city);
	
	Destination getByName(String name);
}
