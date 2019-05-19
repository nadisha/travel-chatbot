const config = {
	app: {
		port: 3000
	},
	jwt: {
		secret: 'access-token-secret',
		refreshTokenSecret: 'refresh-token-secret',
		tokenLife: 900,
		refreshTokenLife: 86400
	},
	apis: {
		authEndpoint: "http://localhost:9966",
		workflowEndpoint: "http://localhost:8866",
		edocumentEndpoint: "http://localhost:7766/dms"
	}
};

module.exports = config;