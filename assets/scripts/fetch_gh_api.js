/* Copyright (C) 2023 Pindorama
 * 		Gabriel Souza (deablofk)
 * 		Luiz Antônio Rangel (takusuman)
 * All rights reserved.
 */

const repoEndPointURL = "https://api.github.com/repos/Projeto-Pindorama/heirloom-ng"
/* https://api.github.com/repos/Projeto-Pindorama/heirloom-ng/tags */

async function getContributors() {
	const repoContributors = `${repoEndPointURL}/contributors`;
	
	try {
		const response = await fetch(repoContributors);
		const contributors = await response.json();
		const list = document.getElementById('contributor-list');

		/* In parallel, we will be fetching user information of all the
		 * contributors. */
		const userPromises = contributors.map(contributor =>
			fetch(contributor.url).then(response =>
				response.json()));
		const users = await Promise.all(userPromises);
		const userNames = users.map(user => user.name);

		for (let i = 0; i < contributors.length; i++) {
			// Define the current contributor
			const contributor = contributors[i];
	
			const listItem = document.createElement('li');
			const hyperLink = document.createElement('a');
			const image = document.createElement('img');
			
			hyperLink.href = contributor.html_url;
			hyperLink.innerHTML = `(<tt>${contributor.login}</tt>)`;
			image.src = contributor.avatar_url;
			image.style.height = '32px';
			image.style.width = '32px';
			listItem.appendChild(image);
			listItem.appendChild(document.createTextNode(`${userNames[i]}`));
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
        const response = await fetch(repoTags);
        const tags = await response.json();
        const latestTag = document.getElementById('latest-tag');
    
        const tagName = document.createElement('tt');
        tagName.textContent = tags[0].name;
        latestTag.appendChild(tagName);
  } catch (error) {
        console.log(`Request to ${repoTags} failed with error: ${error}`);
  }
}
