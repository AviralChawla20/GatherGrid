const express = require("express");
const { StreamChat } = require("stream-chat");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 1112;

// MySQL database connection
const db = mysql.createPool({
  host: "sql12.freemysqlhosting.net",
  user: "sql12647981",
  password: "XM51KVKzDA",
  database: "sql12647981",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Express middleware
app.use(bodyParser.json());
app.use(cors());

// Stream Chat API key and secret
const apiKey = "3n2ymybyf2f4"; // Replace with your Stream Chat API key
const apiSecret =
  "56c8kr3z3cvm2u3jsgvnnvu94rj9hej6w3ue3jmpw49fra5w3nrq8zn8vdpgqqy9"; // Replace with your Stream Chat API secret

// Initialize Stream Chat client
const client = StreamChat.getInstance(apiKey, apiSecret);

// Create tables in the database (call this function before using other routes)
function createTables() {
  // Create the "teams" table if it doesn't exist
  const teamsTableSQL = `
    CREATE TABLE IF NOT EXISTS teams (
        TeamID             INT AUTO_INCREMENT PRIMARY KEY,
        TeamName           VARCHAR(200) NOT NULL,
        TeamCode           VARCHAR(255) NOT NULL,
        ProjectDescription TEXT,
        TeamAdminEmail     VARCHAR(255) NOT NULL,
        TeamAdminName      VARCHAR(255),
        SkillsRequired     TEXT,
        TeamMember         INT
    );
  `;
  db.query(teamsTableSQL, (err) => {
    if (err) throw err;
  });

  // Create the "user_teams" table if it doesn't exist
  const userTeamsTableSQL = `
    CREATE TABLE IF NOT EXISTS user_teams (
        UserEmail VARCHAR(255) NOT NULL,
        TeamID    INT NOT NULL
    );
  `;
  db.query(userTeamsTableSQL, (err) => {
    if (err) throw err;
  });

  // Create the "user_team_info" table if it doesn't exist
  const userTeamInfoTableSQL = `
    CREATE TABLE IF NOT EXISTS user_team_info (
        TeamName           VARCHAR(255),
        TeamCode           VARCHAR(255),
        ProjectDescription TEXT,
        TeamAdminName      VARCHAR(255)
    );
  `;
  db.query(userTeamInfoTableSQL, (err) => {
    if (err) throw err;
  });
}

// Create team route
app.post("/createTeam", async (req, res) => {
  const team = req.body;

  // Ensure required fields are provided
  if (
    !team.TeamCode ||
    !team.TeamName ||
    !team.TeamAdminEmail ||
    !team.TeamAdminName
  ) {
    res.status(400).json({
      error:
        "TeamCode, TeamName, TeamAdminEmail, and TeamAdminName are required",
    });
    return;
  }

  // Set the initial TeamMember value (0 when creating the team)
  team.TeamMember = 0;

  // Create the team
  db.query(
    "INSERT INTO teams (TeamCode, TeamName, ProjectDescription, TeamAdminEmail, TeamAdminName, SkillsRequired, TeamMember) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      team.TeamCode,
      team.TeamName,
      team.ProjectDescription,
      team.TeamAdminEmail,
      team.TeamAdminName,
      team.SkillsRequired,
      team.TeamMember,
    ],
    async (err, result) => {
      if (err) {
        console.error("Error creating team:", err);
        res.status(500).json({ error: "Failed to create a team" });
        return;
      }

      team.TeamID = result.insertId;

      // Add the team admin to the member table
      db.query(
        "INSERT INTO user_teams (UserEmail, TeamID) VALUES (?, ?)",
        [team.TeamAdminEmail, team.TeamID],
        async (err) => {
          if (err) {
            console.error("Error adding team admin to the team:", err);
            res
              .status(500)
              .json({ error: "Failed to add the team admin to the team" });
            return;
          }

          // Create Stream Chat channel
          let userName = team.TeamAdminName.split(" ")[0];
          const updateResponse = await client.upsertUser({
            id: userName,
            name: userName,
            role: "user",
          });
          const channel = client.channel("team", `${team.TeamCode}`, {
            name: `Team channel for ${team.TeamName}`,
            created_by_id: userName,
            members: [userName], // Use a unique identifier for the user
          });

          try {
            await channel.create();
            console.log("Channel Created successfully");
            res.json(team);
          } catch (streamError) {
            console.error("Error creating Stream Chat channel:", streamError);
            res
              .status(500)
              .json({ error: "Failed to create Stream Chat channel" });
          }
        }
      );
    }
  );
});

// Join team route
// Join team route
app.post("/joinTeam", (req, res) => {
  const { user_email, team_code } = req.body;

  // Declare a variable to store the user's name
  let userName;

  db.query(
    "SELECT TeamID FROM teams WHERE TeamCode = ?",
    [team_code],
    (err, result) => {
      if (err) {
        console.error("Error finding team:", err);
        res.status(500).json({ error: "Failed to join the team" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ error: "Team not found" });
        return;
      }

      const teamID = result[0].TeamID;

      // Retrieve the name from the "users" table based on the email ID
      db.query(
        "SELECT name FROM users WHERE email = ?",
        [user_email],
        (err, result) => {
          if (err) {
            console.error("Error retrieving user name:", err);
            res.status(500).json({ error: "Failed to retrieve user name" });
            return;
          }

          if (result.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
          }

          // Assign the retrieved name to the variable
          const userNamess = result[0].name;
          userName = userNamess.split(" ")[0];

          db.query(
            "SELECT EXISTS (SELECT 1 FROM user_teams WHERE UserEmail = ? AND TeamID = ?)",
            [user_email, teamID],
            (err, result) => {
              if (err) {
                console.error("Error checking team membership:", err);
                res
                  .status(500)
                  .json({ error: "Failed to check team membership" });
                return;
              }

              const memberExists = result[0][Object.keys(result[0])[0]];

              if (memberExists) {
                res
                  .status(400)
                  .json({ error: "User is already a member of the team" });
                return;
              }

              db.query(
                "INSERT INTO user_teams (UserEmail, TeamID) VALUES (?, ?)",
                [user_email, teamID],
                async (err) => {
                  if (err) {
                    console.error("Error joining the team:", err);
                    res.status(500).json({ error: "Failed to join the team" });
                    return;
                  }

                  const updateResponse = await client.upsertUser({
                    id: userName,
                    name: userName,
                    role: "user",
                  });

                  const channel = client.channel("team", `${team_code}`, {});

                  await channel.addMembers(
                    [
                      {
                        user_id: `${userName}`,
                        channel_role: "channel_moderator",
                      },
                    ],
                    {
                      text: `${userName} joined the team.`,
                      user_id: `${userName}`,
                    }
                  );
                  // Now you can use the userName variable as needed
                  res.status(201).json({
                    message: "User joined the team successfully",
                    userName,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// User's teams route
app.get("/userTeams", (req, res) => {
  const user_email = req.query.user_email;

  db.query(
    "SELECT teams.TeamName, teams.TeamCode, teams.ProjectDescription, teams.TeamAdminName FROM teams JOIN user_teams ON teams.TeamID = user_teams.TeamID WHERE user_teams.UserEmail = ?",
    [user_email],
    (err, result) => {
      if (err) {
        console.error("Error retrieving user's teams:", err);
        res.status(500).json({ error: "Failed to retrieve user's teams" });
        return;
      }

      res.json(result);
    }
  );
});

// Team members route
app.get("/teamMembers", (req, res) => {
  const team_code = req.query.team_code;

  db.query(
    "SELECT TeamID FROM teams WHERE TeamCode = ?",
    [team_code],
    (err, result) => {
      if (err) {
        console.error("Error finding team:", err);
        res.status(500).json({ error: "Failed to retrieve team members" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ error: "Team not found" });
        return;
      }

      const teamID = result[0].TeamID;

      db.query(
        "SELECT users.name FROM user_teams JOIN users ON user_teams.UserEmail = users.email WHERE user_teams.TeamID = ?",
        [teamID],
        (err, result) => {
          if (err) {
            console.error("Error retrieving team members:", err);
            res.status(500).json({ error: "Failed to retrieve team members" });
            return;
          }

          res.json(result);
        }
      );
    }
  );
});

// Get team details route
app.get("/getTeamDetails", (req, res) => {
  const team_code = req.query.team_code;

  db.query(
    "SELECT TeamID, TeamName, ProjectDescription, TeamAdminName, SkillsRequired, TeamMember FROM teams WHERE TeamCode = ?",
    [team_code],
    (err, result) => {
      if (err) {
        console.error("Error retrieving team details:", err);
        res.status(500).json({ error: "Failed to retrieve team details" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ error: "Team not found" });
        return;
      }

      res.json(result[0]);
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  createTables(); // Create tables when the server starts
});
