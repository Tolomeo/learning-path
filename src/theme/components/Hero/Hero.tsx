import mountains from './mountains.svg'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Container from '../Container'

type Props = {
  children: React.ReactNode
}

const Backdrop = styled('div')(
  ({ theme }) => `
  position: relative;
  padding-block-start: ${theme.spacing(4)};
  background: linear-gradient(360deg, ${theme.palette.primary.dark} 0%, ${
    theme.palette.primary.main
  } 100%);
`,
)

const Content = styled('div')`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
`

const Graphics = styled('img')`
  display: block;
  width: 100%;
  margin-block-end: -1px;
`

const Hero = ({ children }: Props) => (
  <Backdrop>
    <Content>
      <Container maxWidth="xl">
        <Grid container>
          <Grid item xs={9}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Content>
    <Graphics src={mountains.src} alt="" />
  </Backdrop>
)

export default Hero
