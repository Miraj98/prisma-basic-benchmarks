import { Prisma } from "@prisma/client";
import { performance } from "perf_hooks";
import prismaClient from "../prisma/client";
import { nanoid } from "nanoid";
import { getRandomElement, getRandomId } from "../utils";

export async function createUsers(n: number) {
  const usersData: Prisma.UserCreateManyInput[] = [];

  for (let i = 0; i < n; i++) {
    usersData.push({
      email: `${nanoid()}@hallparty.app`,
      name: `Name-${nanoid()}`,
    });
  }

  const resp = await prismaClient.user.createMany({
    data: usersData,
  });

  console.log("Created", resp.count, "users");
}

export async function createPosts(n: number) {
  const usersCount = await prismaClient.user.count();
  const postData: Prisma.PostCreateManyInput[] = [];

  for (let i = 0; i < n; i++) {
    const authorId = getRandomId(1, usersCount);
    postData.push({
      title: `Title-${nanoid()}`,
      content: `Content-${nanoid()}`,
      authorId,
    });
  }

  const resp = await prismaClient.post.createMany({
    data: postData,
  });

  console.log("Created", resp.count, "posts");
}

export async function createComments(n: number) {
  const [users, posts] = await Promise.all([
    prismaClient.user.findMany({
      select: {
        id: true,
      },
    }),
    prismaClient.post.findMany({
      select: {
        id: true,
      },
    }),
  ]);

  const commentData: Prisma.CommentCreateManyInput[] = [];
  const postIds = posts.map((u) => u.id);
  const userIds = users.map((u) => u.id);

  console.log("User count", userIds.length);
  console.log("Post count", postIds.length);

  for (let i = 0; i < n; i++) {
    let postId = getRandomElement(postIds);
    let authorId = getRandomElement(userIds);

    commentData.push({
      content: `Comment content-${nanoid()}`,
      authorId: authorId ?? 1,
      postId: postId ?? 1,
    });
  }

  const resp = await prismaClient.comment.createMany({
    data: commentData,
  });

  console.log("Created", resp.count, "comments");
}

export async function initRecords() {
  const start = performance.now();
  await createUsers(10000);
  await createPosts(10000);
  await createComments(10000);
  const timetaken = performance.now() - start;
  console.log("Time taken to create record", timetaken, "ms");
}

initRecords();
