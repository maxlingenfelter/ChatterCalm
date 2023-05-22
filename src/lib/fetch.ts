export interface FetchOptions {
	headers?: object;
}

export const get = async <T = any>(
	url: string,
	options: FetchOptions = {}
): Promise<T> => {
	try {
		const res = await fetch(url, {
			headers: {
				...options.headers,
			},
		});

		if (!res.ok) {
			// Server returned an error
			let body: { error: string };
			try {
				// Try to parse the error as json
				body = await res.json();
			} catch (e) {
				console.log("Error parsing error response as JSON:", e);

				// Another unexpected error occurred
				return Promise.reject("UNKNOWN_ERROR");
			}
			// Throw the server returned error
			return Promise.reject(body.error);
		}

		// If server returned a success, the response is guaranteed to be json
		return await res.json();
	} catch (e) {
		console.error("Network Error:", e);

		throw "NETWORK_ERROR";
	}
};

export const del = async <T = any>(
	url: string,
	options: FetchOptions = {}
): Promise<T> => {
	try {
		const res = await fetch(url, {
			method: "DELETE",
			headers: {
				...options.headers,
			},
		});

		if (!res.ok) {
			// Server returned an error
			let body: { error: string };
			try {
				// Try to parse the error as json
				body = await res.json();
			} catch (e) {
				console.log("Error parsing error response as JSON:", e);

				// Another unexpected error occurred
				return Promise.reject("UNKNOWN_ERROR");
			}
			// Throw the server returned error
			return Promise.reject(body.error);
		}

		if (res.headers.get("Content-Type") === "application/json") {
			// If server returned a success, the response is guaranteed to be json
			return await res.json();
		} else {
			return null;
		}
	} catch (e) {
		console.error("Network Error:", e);

		throw "NETWORK_ERROR";
	}
};

export const post = async <T = any>(
	url: string,
	body: object,
	options: FetchOptions = {}
): Promise<T> => {
	try {
		let res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			// Server returned an error
			let body: { error: string };
			try {
				// Try to parse the error as json
				body = await res.json();
			} catch (e) {
				console.log("Error parsing error response as JSON:", e);

				// Another unexpected error occurred
				return Promise.reject("UNKNOWN_ERROR");
			}
			// Throw the server returned error
			return Promise.reject(body.error);
		}

		return await res.json();
	} catch (e) {
		console.error("Network Error:", e);

		throw "NETWORK_ERROR";
	}
};

export const put = async <T = any>(
	url: string,
	body: object,
	options: FetchOptions = {}
): Promise<T> => {
	try {
		let res = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			// Server returned an error
			let body: { error: string };
			try {
				// Try to parse the error as json
				body = await res.json();
			} catch (e) {
				console.log("Error parsing error response as JSON:", e);

				// Another unexpected error occurred
				return Promise.reject("UNKNOWN_ERROR");
			}
			// Throw the server returned error
			return Promise.reject(body.error);
		}

		return await res.json();
	} catch (e) {
		console.error("Network Error:", e);

		throw "NETWORK_ERROR";
	}
};
