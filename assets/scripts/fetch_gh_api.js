/* Copyright (C) 2023 Pindorama
 * 		Gabriel Souza (deablofk)
 * 		Luiz Antônio Rangel (takusuman)
 * All rights reserved.
 */

const repoEndPointURL = "https://api.github.com/repos/Projeto-Pindorama/heirloom-ng"

async function getContributors() {
	const repoContributors = `${repoEndPointURL}/contributors`;

	try {
		const response = await fetch(repoContributors),
			contributors = await response.json(),
			list = document.getElementById('contributor-list'),
			/* In parallel, we will be fetching user information
			 * of all the contributors. */
			userPromises = contributors.map(contributor =>
				fetch(contributor.url).then(response =>
					response.json())),
			users = await Promise.all(userPromises),
			userNames = users.map(user => user.name);

		for (let i = 0; i < contributors.length; i++) {
			const contributor = contributors[i],
				listItem = document.createElement('li'),
				hyperLink = document.createElement('a'),
				image = document.createElement('img');

			hyperLink.href = contributor.html_url;
			hyperLink.innerHTML = `(<tt>${contributor.login}</tt>)`;
			image.src = contributor.avatar_url;
			image.style.height = '32px';
			image.style.width = '32px';
			listItem.appendChild(image);
			listItem.appendChild(document.createTextNode(" "));
			listItem.appendChild(document.createTextNode(`${userNames[i]}`));
			listItem.appendChild(document.createTextNode(" "));
			listItem.appendChild(hyperLink);
			image.style.border = "0.1em solid black";
			list.appendChild(listItem);
		}
	} catch (error) {
		console.log(`Request to ${repoContributors} failed with error ${error}`);
	}
}

async function getLatestTag() {
	/* This will, in fact, get all the tags released until today. */
	const repoTags = `${repoEndPointURL}/tags`;

	try {
		const response = await fetch(repoTags),
			tags = await response.json(),
			latestTag = document.getElementById('latest-tag');

		const tagName = document.createElement('tt');
		tagName.textContent = tags[0].name;
		latestTag.appendChild(tagName);
	} catch (error) {
		console.log(`Request to ${repoTags} failed with error: ${error}`);
	}
}

async function getIssues() {
	const repoIssues = `${repoEndPointURL}/issues`;

	try {
		const response = await fetch(repoIssues),
			issues = await response.json(),
			list = document.getElementById('issues-list');
		let i = 0;

		for (i = 0; i < issues.length; i++) {
			const listItem = document.createElement('li'),
				hyperLink = document.createElement('a');
			let j = 0;
			var cinema = "",
				typeicon = "",
				severity = "";
			
			typeicon = (issues[i].pull_request)
				? "⚙️"
				: "💡" ;

			if (issues[i].pull_request) {
				console.log(`${issues[i].number} is actually a pull_request.`);
			}
			
			for (j = 0; j < issues[i].labels.length; j++) {
				switch(issues[i].labels[j].name) {
					case "help wanted":
						severity = "🆘";
						cinema = "movie"; // Hello! This is Ice MC.
						break;
					default:
						break; // No operation.
				}
				if (cinema) break;
			}

			if (severity) {
				listItem.appendChild(document.createTextNode(" "));
				MMSpan = document.createElement("span");
				MMSpan.setAttribute("role", "img");
				MMSpan.setAttribute("aria-label", "Needs help.");
				MMSpan.innerHTML = `(${severity})`;
				listItem.appendChild(MMSpan);
			}
			listItem.appendChild(document.createTextNode(typeicon));
			hyperLink.href = issues[i].html_url;
			hyperLink.innerHTML = `#${issues[i].number}`;
			listItem.appendChild(hyperLink);
			listItem.appendChild(document.createTextNode(" "));
			listItem.appendChild(document.createTextNode(issues[i].title));
		
			list.appendChild(listItem);
		}
	} catch (error) {
		console.log(`Request to ${repoIssues} failed with error: ${error}`);
	}
}
