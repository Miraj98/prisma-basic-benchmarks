import prismaClient from "./prisma/client";
import { getRandomId } from "./utils";
import { performance } from "perf_hooks";

async function fetchPosts() {
  const start = performance.now();
  /*
  const posts = await prismaClient.post.findMany({
    where: {
      authorId: 1,
    },
    include: {
      author: true,
      comments: true,
    }
  })
  */
  const posts = await prismaClient.post.findMany({
    where: {
      id: {
        in: [
          123, 420, 690, 6969, 6942, 1000, 3689, 3000, 2000, 2421, 23, 42, 96,
          101, 201, 301, 401, 501,
        ],
      },
    },
    include: {
      author: true,
      comments: true,
    },
  });

  const timeTaken = performance.now() - start;

  console.log(
    "Time taken to fetch user posts with author and comments",
    timeTaken
  );
  console.log("Number of Posts fetched", posts.length);
}

async function fetchPostComments() {
  const postId = getRandomId(1, 10000);
  const start = performance.now();

  const comments = await prismaClient.comment.findMany({
    where: {
      postId,
    },
    select: {
      author: true,
      post: true,
    },
  });

  const timeTaken = performance.now() - start;

  console.log(
    "Time taken to fetch comments with post and author populated",
    timeTaken
  );
  console.log("comments fetched", comments.length);
}

async function main() {
  await fetchPosts();
  await fetchPostComments();
}

main();
