import { Bot, Post } from "@skyware/bot";
import { LabelerServer } from "@skyware/labeler";

// pathselector: at://did:plc:eivabf3dhre6rtqs2tkyj6f2/app.bsky.feed.post/3l7qxpakwwn22
// technicangel: at://did:plc:eivabf3dhre6rtqs2tkyj6f2/app.bsky.feed.post/3l7qxpbmgab2f

const server = new LabelerServer({
  did: process.env.LABELER_DID ?? "",
  signingKey: process.env.SIGNING_KEY ?? "",
});

server.start(14831, (error) => {
  if (error) {
    console.error("Failed to start server:", error);
  } else {
    console.log("Labeler server running on port 14831");
  }
});

const bot = new Bot();
await bot.login({
  identifier: process.env.LABELER_DID ?? "",
  password: process.env.LABELER_PASSWORD ?? "",
});

const postsToLabels: Record<string, string> = {
  "at://did:plc:eivabf3dhre6rtqs2tkyj6f2/app.bsky.feed.post/3l7qxpakwwn22":
    "pathselector",
  "at://did:plc:eivabf3dhre6rtqs2tkyj6f2/app.bsky.feed.post/3l7qxpbmgab2f":
    "technicangel",
};

bot.on("like", async ({ subject, user }) => {
  if (subject instanceof Post) {
    console.log(subject.uri);
    const label = postsToLabels[subject.uri];
    if (label) {
      await user.labelAccount([label]);
    }
  }
});
