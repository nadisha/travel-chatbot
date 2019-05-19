package org.travel.ontology.api;

import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.travel.ontology.domain.Destination;
import org.travel.ontology.service.DestinationService;

@RestController
@RequestMapping("/api/travel/ontology")
public class TravelRestController {
	
	@Autowired
	private DestinationService destinationService;
	
	@GetMapping("/destinations")
	public List<Destination> getAllDestinationsByCity(@RequestParam String city) {		
		return destinationService.getByCity(city);
	}
	
	@GetMapping("/destinations/details")
	public Destination getDestinationDetails(@RequestParam String name) {
		return destinationService.getByName(name);
	}
}
