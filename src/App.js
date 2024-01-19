import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
// import Cookies from "js-cookie";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  ChannelList,
} from "stream-chat-react";
import "@stream-io/stream-chat-css/dist/css/index.css";

const apiKey = process.env.REACT_APP_STREAM_API_KEY;
// const name = localStorage.getItem("name").;

// const team_id = localStorage.getItem("team_id");
// const team_name = localStorage.getItem("team_name");
// Cookies.get(team_code);
// Cookies.get(userNamee);
// let uname;
// uname = userNamee.split(" ")[0];

const user = {
  id: "Aviral",
  name: "Aviral",
  image: "https://getstream.imgix.net/images/random_svg/FS.png",
};
// console.log(uname);
// console.log(team_id);
const filters = {
  type: "team",
  members: { $in: [user.id] },
  id: { $in: ["1700883459674"] },
};
const sort = { last_message_at: -1 };

export default function App() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function init() {
      // Fetch user token from the server
      const response = await fetch("http://localhost:1111/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        console.error("Failed to fetch user token");
        return;
      }

      const { token } = await response.json();

      // Connect the user using the fetched token
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(user, token);

      const channel = chatClient.channel("team", "react-talk", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Team Chat",
        members: [user.id],
      });

      const channel2 = chatClient.channel("team", "163426", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Team Chat 2",
        members: [user.id],
      });

      await channel.watch();
      await channel2.watch();

      setClient(chatClient);
    }

    init();

    if (client) return () => client.disconnectUser();
  }, []);

  if (!client) return <LoadingIndicator />;

  return (
    <Chat client={client} theme={"messaging dark"}>
      <ChannelList filters={filters} sort={sort} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
