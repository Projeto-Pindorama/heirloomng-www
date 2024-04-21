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
		let i = 0;
		for (i = 0; i < contributors.length; i++) {
			const listItem = document.createElement('li'),
				hyperLink = document.createElement('a'),
				image = document.createElement('img'),
				usernam = document.createElement('tt');

			hyperLink.href = contributors[i].html_url;
			usernam.textContent = `(${contributors[i].login})`;
			hyperLink.appendChild(usernam);
			image.src = contributors[i].avatar_url;
			image.style.height = '32px';
			image.style.width = '32px';
			listItem.appendChild(image);
			listItem.appendChild(document.createTextNode(" "));
			listItem.appendChild(document.createTextNode(userNames[i]));
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
				severity = { 
					asusual: "",
					help: ""
				};
			
			typeicon = (issues[i].pull_request)
				? "⚙️"
				: "💡" ;

			/* Set if this is a normal issue/pull-request
			 * or if we need help */
			severity.asusual = "#00005b";
			for (j = 0; j < issues[i].labels.length; j++) {
				switch(issues[i].labels[j].name) {
					case "help wanted":
						severity.help = "#ff0000";
						cinema = "movie"; // Hello! This is Ice MC.
						break;
					default:
						break; // No operation.
				}
				if (cinema) break;
			}

			/* Change colour and style of words on the upper text. */
			const asusual = document.getElementById('asusual'),
				help = document.getElementById('help');
			if (!asusual.style.fontWeight || !help.style.color) {
				asusual.style.color = severity.asusual;
				asusual.style.fontWeight = "bold";
				help.style.color = severity.help;
				help.style.fontWeight = "bold";
			}
		
			listItem.appendChild(document.createTextNode(typeicon));
			/* Hyperlink with colour and style. */
			hyperLink.href = issues[i].html_url;
			hyperLink.innerHTML = `#${issues[i].number}`;
			hyperLink.style.color = (severity.help)
						? severity.help
						: severity.asusual;
			hyperLink.style.fontWeight = "bold";
			if (severity.help) hyperLink.style.fontStyle = "italic";
			listItem.appendChild(hyperLink);
			/* And then the title. */	
			listItem.appendChild(document.createTextNode(" "));
			listItem.appendChild(document.createTextNode(issues[i].title));
		
			list.appendChild(listItem);
		}
	} catch (error) {
		console.log(`Request to ${repoIssues} failed with error: ${error}`);
	}
}
