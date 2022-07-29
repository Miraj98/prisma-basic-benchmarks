import { Prisma } from '@prisma/client';
import { performance } from 'perf_hooks';
import prismaClient from '../prisma/client'
import {nanoid} from 'nanoid'

export function getRandomId(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function createUsers(n: number) {
  const usersData: Prisma.UserCreateManyInput[] = []

  for (let i = 0; i < n; i++) {
    usersData.push({
      email: `${nanoid()}@hallparty.app`,
      name: `Name-${nanoid()}`,
    })
  }

  const resp = await prismaClient.user.createMany({
    data: usersData,
  })

  console.log("Created", resp.count, "users");
}

export async function createPosts(n: number) {
  const usersCount = await prismaClient.user.count()
  const postData: Prisma.PostCreateManyInput[] = []

  for (let i = 0; i < n; i++) {
    const authorId = getRandomId(1, usersCount);
    postData.push({
      title: `Title-${nanoid()}`,
      content: `Content-${nanoid()}`,
      authorId: 1, 
    })
  }

  const resp = await prismaClient.post.createMany({
    data: postData
  })

  console.log("Created", resp.count, "posts");
}

export async function createComments(n: number) {
  const usersCount = await prismaClient.user.count()
  const postsCount = await prismaClient.post.count()
  const commentData: Prisma.CommentCreateManyInput[] = []

  console.log("User count", usersCount)
  console.log("Post count", postsCount);

  for (let i = 0; i < n; i++) {
    let postId = getRandomId(1, postsCount);
    let authorId = getRandomId(1, usersCount);

    commentData.push({
      content: `Comment content-${nanoid()}`,
      authorId,
      postId,
    })
  }

  const resp = await prismaClient.comment.createMany({
    data: commentData,
  })

  console.log("Created", resp.count, "comments");
}


export async function initRecords() {
  const start = performance.now()
  // await createUsers(10000)
  await createPosts(4600);
  // await createComments(4620);
  const timetaken = performance.now() - start;
  console.log("Time taken to create record", timetaken, "ms");
}

// initRecords()

