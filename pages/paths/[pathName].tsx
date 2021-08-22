import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { paths, populatePath, PopulatedPath } from '../../data'
import { Header, Main, Column, H1 } from '../../src/shared'
import { Path } from '../../src/path'

interface Params extends ParsedUrlQuery {
    pathName: string
}

interface StaticProps {
    path: PopulatedPath
}

export const getStaticPaths: GetStaticPaths = async () => {
    const staticPaths = Object.keys(paths).map((pathName) => ({
        params: { pathName }
    }))

    return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({ params }) => {
  const path = paths[params!.pathName]
  const populatedPath = populatePath(path)

  return {
    props: {
      path: populatedPath,
    }
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ path }: Props) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Main>
          <Column>
              <H1>The <u>{path.title}</u> learning path</H1>
          </Column>

          <Column>
            <Path path={path} />
        </Column>
      </Main>

    </div>
  )
}

