package org.travel.ontology.domain;

public class Budget {
	private String currency;

	private float adultCharge;

	private float childCharge;

	private boolean isFree;

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public float getAdultCharge() {
		return adultCharge;
	}

	public void setAdultCharge(float adultCharge) {
		this.adultCharge = adultCharge;
	}

	public float getChildCharge() {
		return childCharge;
	}

	public void setChildCharge(float childCharge) {
		this.childCharge = childCharge;
	}

	public boolean isFree() {
		return isFree;
	}

	public void setFree(boolean isFree) {
		this.isFree = isFree;
	}	
}
