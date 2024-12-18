import InitialModal from "@/components/modals/initial-model";
import prisma from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  // console.log(profile);

  return (
    <>
      <InitialModal />
    </>
  );
};

export default SetupPage;
