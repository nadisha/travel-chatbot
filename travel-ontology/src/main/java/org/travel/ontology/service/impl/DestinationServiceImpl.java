package org.travel.ontology.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.sparql.function.library.leviathan.cos;
import org.apache.jena.util.FileManager;
import org.springframework.stereotype.Service;
import org.travel.ontology.domain.Area;
import org.travel.ontology.domain.Budget;
import org.travel.ontology.domain.Destination;
import org.travel.ontology.domain.Season;
import org.travel.ontology.service.DestinationService;
import org.travel.ontology.util.OntologyUtil;

@Service
public class DestinationServiceImpl implements DestinationService {
	
	private String inputFileName = "travel.rdf";

	@Override
	public Destination getByName(String name) {
		Destination destination = null;
		
		Model model = getOntologyModel();
		
		String queryString = 
				" PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
				" PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" PREFIX travel: <http://www.semanticweb.org/nadisha/ontologies/2019/2/travel#> " +				
				" SELECT DISTINCT  " +
				"    ?description " +
				"    ?address " +
				"    ?areaName " +
				"    ?bestTimeName " +
				"    ?startMonth " +
				"    ?endMonth " +
				"    ?currency " +
				"    ?adultCharge " +
				"    ?childCharge " +
				" WHERE { " +
				"    ?destination travel:hasName '" + name + "'. " +
				"    ?destination travel:hasDescription ?description. " +
				"    ?destination travel:hasAddress ?address. " +
				"    OPTIONAL {?destination travel:hasArea ?area.}. " +
				"    OPTIONAL {?area travel:hasName ?areaName.}. " +
				"    OPTIONAL { "+ 
				"		?destination travel:hasBestTime ?bestTime. " + 
				"		?bestTime travel:hasName ?bestTimeName. " +
				"		?bestTime travel:hasStartMonth ?startMonth. " +
				"		?bestTime travel:hasEndMonth ?endMonth." +
				"	 }. " +
				"    OPTIONAL { " +
				"		?destination travel:hasCost ?cost. " +
				"		OPTIONAL {?cost travel:hasCurrency ?currency.}. " +
				"		OPTIONAL { " +
				"			?cost travel:hasPerAdultCharge ?adultCharge. " +
				"			?cost travel:hasPerChildCharge ?childCharge. " +
				"		}." +
				"	 }. " +
				" }";
		
		Query query = QueryFactory.create(queryString);

		// Execute the query and obtain results
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		
		while(results.hasNext()) {
			QuerySolution q = results.nextSolution();
			
			Season season = new Season();
			season.setName(OntologyUtil.getStringLiteral(q, "bestTimeName"));
			season.setStartMonth(OntologyUtil.getStringLiteral(q, "startMonth"));
			season.setEndMonth(OntologyUtil.getStringLiteral(q, "endMonth"));
			
			Budget cost = new Budget();
			cost.setCurrency(OntologyUtil.getStringLiteral(q, "currency"));			
			cost.setAdultCharge(OntologyUtil.getFloatLiteral(q, "adultCharge"));
			cost.setChildCharge(OntologyUtil.getFloatLiteral(q, "childCharge"));
			if (cost.getAdultCharge() == 0f && cost.getChildCharge() == 0f) {
				cost.setFree(Boolean.TRUE);
			}
			
			Area area = new Area();
			area.setName(OntologyUtil.getStringLiteral(q, "areaName"));
			
			destination = new Destination();
			destination.setName(name);
			destination.setDescription(OntologyUtil.getStringLiteral(q, "description"));
			destination.setAddress(OntologyUtil.getStringLiteral(q, "address"));			
			destination.setSeason(season);
			destination.setBudget(cost);
			destination.setArea(area);
			
//			break; // Explicitly break
		}
		
		qe.close();	
		return destination;
	}
	
	@Override
	public List<Destination> getByCity(String city) {
		List<Destination> destList = new ArrayList<>();
		
		Model model = getOntologyModel();
		
		// Create a new query
		String queryString = 
		    " PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
		    " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
		    " PREFIX travel: <http://www.semanticweb.org/nadisha/ontologies/2019/2/travel#> " +				
		    " SELECT DISTINCT  " +
		    "    ?DestinationName " +
		    " WHERE { " +
		    "    ?subtype rdfs:subClassOf travel:CulturalDestination. " +
		    "    { ?subject rdf:type ?subtype. } UNION { ?subject rdf:type travel:CulturalDestination. } . " +
		    "    ?subject travel:hasArea ?area. " +
		    "    ?area travel:hasName '" + city + "'. " +
		    "    ?subject travel:hasName ?DestinationName " +
		    " }";

		Query query = QueryFactory.create(queryString);

		// Execute the query and obtain results
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();

		while(results.hasNext()) {
			Destination d = new Destination();
			d.setName(results.next().get("DestinationName").toString());
			destList.add(d);
		}

		// Important ‑ free up resources used running the query
		qe.close();							
		
		return destList;
	}

	private Model getOntologyModel() {
		// create an empty model
		Model model = ModelFactory.createDefaultModel();

		// use the FileManager to find the input file
		try (InputStream in = FileManager.get().open( inputFileName )) {
			if (in == null) {
				throw new IllegalArgumentException("File: " + inputFileName + " not found");		
			}	
			model.read(in, null);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return model;
	}
}
