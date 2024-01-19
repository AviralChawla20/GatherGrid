// Install the required packages
// npm install stream-chat stream-chat-react @stream-io/stream-chat-css

import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  Window,
} from "stream-chat-react";

import "stream-io/stream-chat-css/dist/css/index.css";

const apiKey = process.env.REACT_APP_STREAM_API_KEY;

const user = {
  id: "john",
  name: "John",
  image: "https://getstream.imgix.net/images/random_svg/FS.png",
};

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apiKey);

      await chatClient.connectUser(user, chatClient.devToken(user.id));

      const channel = chatClient.channel("messaging", "react-talk", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Talk about React",
        members: [user.id],
      });

      await channel.watch();

      setChannel(channel);
      setClient(chatClient);
    }

    init();

    if (client) return () => client.disconnectUser();
  }, []);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <Chat client={client} theme={"messaging light"}>
      <Channel channel={channel}>
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

// const App = () => {
//   const [client, setClient] = useState(null);

//   useEffect(() => {
//     const initializeStreamChat = async () => {
//       // Replace 'your_api_key' with your actual Stream Chat API key
//       const apiKey=process.env.REACT_APP_STREAM_API_KEY;
//     //   const apiKey = "3n2ymybyf2f4";
//       const userId = "dave-matthews";
//       const userToken = await getUserToken(userId);
//       // Initialize Stream Chat client
//       const newClient = new StreamChat(apiKey);

//       // Handle connection changes
//       const handleConnectionChange = ({ online = false }) => {
//         if (!online) return console.log("Connection lost");
//         setClient(newClient);
//       };

//       // Add connection change listener
//       newClient.on("connection.changed", handleConnectionChange);

//       // Replace 'your_user_token' with the user token obtained from your server
//       await newClient.connectUser(
//         {
//           id: "dave-matthews", // Replace with your user ID
//           name: "Dave Matthews", // Replace with your user name
//         },
//         userToken
//       );

//       return () => {
//         // Remove connection change listener
//         newClient.off("connection.changed", handleConnectionChange);

//         // Disconnect user when component unmounts
//         newClient.disconnectUser().then(() => console.log("Connection closed"));
//       };
//     };

//     // Initialize Stream Chat when component mounts
//     initializeStreamChat();
//   }, []);

//   if (!client) return null;
//   const getUserToken = async (userId) => {
//     const response = await fetch("http://localhost:3000/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ user_id: userId }),
//     });

//     const data = await response.json();
//     return data.token;
//   };
//   return (
//     <Chat client={client}>
//       <ChannelList
//         filters={{ type: "messaging" }}
//         sort={{ last_message_at: -1 }}
//         options={{ state: true, presence: true, limit: 10 }}
//       />
//       <Channel>
//         <Window>
//           <ChannelHeader />
//           <MessageList />
//           <MessageInput />
//         </Window>
//         <Thread />
//       </Channel>
//     </Chat>
//   );
// };

// export default App;
