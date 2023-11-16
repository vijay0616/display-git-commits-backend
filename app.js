const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());

app.get("/api/repository/:owner/:repo/commits/:oid", async (req, res) => {
  try {
    const { owner, repo, oid } = req.params;

    // Fetch commits from the GitHub API
    const githubResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits/${oid}`
    );

    let message = githubResponse.data.commit.message.split('\n');
    console.log(message);

    // Extract relevant data from the GitHub API response
    const commits = {
      oid: githubResponse.data.sha,
      subject: message.shift(),
      body: message.join(' '),
      parents: githubResponse.data.parents,
      author: githubResponse.data.commit.author,
      committer: githubResponse.data.commit.committer,
      files: githubResponse.data.files,
    };

    // Send the formatted data as the API response
    res.status(200).json({ ...commits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
