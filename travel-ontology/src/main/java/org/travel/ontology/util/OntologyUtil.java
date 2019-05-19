package org.travel.ontology.util;

import java.util.Optional;

import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.Literal;

public class OntologyUtil {
	public static String getStringLiteral(QuerySolution q, String fieldName) {
		Optional<Literal> op = Optional.ofNullable(q.getLiteral(fieldName));
		if (op.isPresent()) {
			return op.get().getString();
		} else {
			return "";
		}
	}
	
	public static float getFloatLiteral(QuerySolution q, String fieldName) {
		Optional<Literal> op = Optional.ofNullable(q.getLiteral(fieldName));
		if (op.isPresent()) {
			return op.get().getFloat();
		} else {
			return 0f;
		}
	}
}
