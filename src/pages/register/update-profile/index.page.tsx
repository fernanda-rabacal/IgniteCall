import { Container, Header } from "../styles";
import { Heading, Text, MultiStep, Button, TextArea, Avatar } from "@ignite-ui/react"
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from "@/lib/axios";
import { FormAnnotation, ProfileBox } from "./styles";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import { useRouter } from "next/router";

const updateProfileSchema = z.object({
  bio: z.string()
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const { 
    register, 
    handleSubmit,
    formState: { isSubmitting } 
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema)
  })

  const { data: session } = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put('/users/profile', {
      bio: data.bio
    })

    await router.push(`/schedule/${session?.user.username}`)
  }

  return(
    <Container>
      <Header>
        <Heading as="strong">Defina sua disponibilidade</Heading>
        <Text>            
          Por último, uma breve descrição e uma foto de perfil.
        </Text>

        <MultiStep size={4} currentStep={4}/>
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Foto de Perfil</Text>
          <Avatar src={session?.user.avatar_url} alt={session?.user.name} />
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register("bio")} />
          <FormAnnotation size="sm">Fale um pouco sobre você. Isto será exibido em sua página pessoal.</FormAnnotation>
        </label>

        <Button disabled={isSubmitting}>
          Finalizar

          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  )

  return {
    props: {
      session
    }
  }
}