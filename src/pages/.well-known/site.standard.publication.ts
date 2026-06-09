export const prerender = false;
import type { APIRoute } from "astro";
import { generatePublicationWellKnown } from "@bryanguffey/astro-standard-site";

export const GET: APIRoute = () => {
	return new Response(
		generatePublicationWellKnown({
			did: "did:plc:dyj52k5ioswbvwwh4lwlrzcb", // Your DID
			publicationRkey: "3mnqrmppxwksd" // From create-publication output
		}),
		{ headers: { "Content-Type": "text/plain" } }
	);
};
