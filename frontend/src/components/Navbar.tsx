import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: '#202c33',
        borderBottom: '1px solid',
        borderColor: '#374045',
        minHeight: 64,
        justifyContent: 'center',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: {
            lg: '1200px',
            xl: '1400px'
          },
          px: { xs: 2, md: 4 },
        }}
      >
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <WhatsAppIcon sx={{ color: '#00a884', fontSize: 32, mr: 1 }} />
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/"
              sx={{ 
                color: '#e9edef',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.5px',
                fontFamily: 'Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Wavoip Outbound Caller
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={RouterLink}
              to="/vapi-tokens"
              startIcon={<StorageIcon />}
              sx={{
                color: isActive('/vapi-tokens') ? '#00a884' : '#8696a0',
                bgcolor: isActive('/vapi-tokens') ? 'rgba(0,168,132,0.08)' : 'transparent',
                '&:hover': {
                  color: '#00a884',
                  bgcolor: 'rgba(0,168,132,0.12)',
                },
                minWidth: '120px',
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              Vapi Tokens
            </Button>
            <Button
              component={RouterLink}
              to="/wavoip-tokens"
              startIcon={<StorageIcon />}
              sx={{
                color: isActive('/wavoip-tokens') ? '#00a884' : '#8696a0',
                bgcolor: isActive('/wavoip-tokens') ? 'rgba(0,168,132,0.08)' : 'transparent',
                '&:hover': {
                  color: '#00a884',
                  bgcolor: 'rgba(0,168,132,0.12)',
                },
                minWidth: '120px',
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              Wavoip Tokens
            </Button>
            <Button
              component={RouterLink}
              to="/calls"
              startIcon={<DescriptionIcon />}
              sx={{
                color: isActive('/calls') ? '#00a884' : '#8696a0',
                bgcolor: isActive('/calls') ? 'rgba(0,168,132,0.08)' : 'transparent',
                '&:hover': {
                  color: '#00a884',
                  bgcolor: 'rgba(0,168,132,0.12)',
                },
                minWidth: '120px',
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              Calls
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: '#8696a0',
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': {
                color: '#fff',
                bgcolor: '#ea4335',
              },
              transition: 'all 0.2s',
              ml: 2
            }}
          >
            Sair
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 