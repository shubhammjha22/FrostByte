import prisma from "./db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberOneId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const convo = await prisma.conversation.findFirst({
      where: {
        OR: [
          { memberOneId, memberTwoId },
          { memberOneId: memberTwoId, memberTwoId: memberOneId }, // Handle reverse order
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    // console.log("here is convo 1 ,", convo);
    return convo;
  } catch (error) {
    // console.log("error is this 1", error);

    return null;
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    // console.log("Member One ID:", memberOneId);
    // console.log("Member Two ID:", memberTwoId);
    const convo = await prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return convo;
  } catch (error: any) {
    console.error(
      "Error occurred:",
      JSON.stringify(error, null, 2) || "No error object"
    );

    return null;
  }
};
