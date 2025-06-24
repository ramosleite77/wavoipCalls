import { Box, Typography, Link, Grid } from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkIcon from '@mui/icons-material/Link';

const Footer = () => {

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0c1317',
        color: '#8696a0',
        py: 1.5,
        px: 1.5,
        borderTop: '1px solid #374045',
        width: '100%'
      }}
    >
      <Box sx={{ 
        maxWidth: {
          lg: '1200px',
          xl: '1400px'
        },
        mx: 'auto'
      }}>
        <Grid container spacing={2}>
          {/* Coluna 1 - Logo e Copyright */}
          <Grid item xs={12} md={3} sx={{ mb: { xs: 1, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <img
                src="/icons/android-icon-48x48.png"
                alt="Logo Wavoip"
                style={{ width: 18, height: 18 }}
              />
              <Typography variant="subtitle1" sx={{ color: '#e9edef', fontWeight: 600, fontSize: 16 }}>
                Wavoip Outbound Caller
              </Typography>
            </Box>
          </Grid>

          {/* Coluna 2 - Redes Sociais */}
          <Grid item xs={12} md={3} sx={{ mb: { xs: 1, md: 0 } }}>
            <Typography variant="body2" sx={{ color: '#e9edef', mb: 1, fontWeight: 600 }}>
              Redes Sociais
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link
                href="https://www.youtube.com/@ComunidadeZDG"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <YouTubeIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>YouTube</Typography>
              </Link>
              <Link
                href="https://www.instagram.com/comunidadezdg"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <InstagramIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>@comunidadezdg</Typography>
              </Link>
              <Link
                href="https://www.instagram.com/wavoip_oficial"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <InstagramIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>@wavoip_oficial</Typography>
              </Link>
            </Box>
          </Grid>

          {/* Coluna 3 - Links */}
          <Grid item xs={12} md={3} sx={{ mb: { xs: 1, md: 0 } }}>
            <Typography variant="body2" sx={{ color: '#e9edef', mb: 1, fontWeight: 600 }}>
              Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link
                href="https://wavoip.com/"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <LinkIcon sx={{ fontSize: 15 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>Wavoip</Typography>
              </Link>
              <Link
                href="https://comunidadezdg.com.br"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <LinkIcon sx={{ fontSize: 15 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>Comunidade ZDG</Typography>
              </Link>
              <Link
                href="https://comunidadezdg.com.br/zpro"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <LinkIcon sx={{ fontSize: 15 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>ZPRO</Typography>
              </Link>
            </Box>
          </Grid>

          {/* Coluna 4 - Contato */}
          <Grid item xs={12} md={3}>
            <Typography variant="body2" sx={{ color: '#e9edef', mb: 1, fontWeight: 600 }}>
              Contato
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link
                href="https://chat.whatsapp.com/I01kn65n3CqKFvRIIvQ6hM"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>Grupo Wavoip</Typography>
              </Link>
              <Link
                href="https://wa.me/5515998566622"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#8696a0',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  '&:hover': { color: '#00a884' }
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>Whatsapp (ZDG)</Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer; 