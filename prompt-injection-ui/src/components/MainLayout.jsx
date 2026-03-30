import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GppBadIcon from '@mui/icons-material/GppBad';
import ShieldIcon from '@mui/icons-material/Shield';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { APP_TITLE, TABS } from '../constants';
import ChatIntegrationTab from './ChatIntegrationTab';
import VulnerableTab from './VulnerableTab';
import GuardedTab from './GuardedTab';
import TicketsTab from './TicketsTab';

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      sx={{ display: value === index ? 'block' : 'none', py: 3 }}
    >
      {children}
    </Box>
  );
}

const TAB_ICONS = [
  <SmartToyIcon key="demo" fontSize="small" />,
  <GppBadIcon key="vuln" fontSize="small" />,
  <ShieldIcon key="guard" fontSize="small" />,
  <ConfirmationNumberIcon key="tickets" fontSize="small" />,
];

export default function MainLayout({ username, onLogout, isDark, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(144, 202, 249, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {APP_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={username}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Tooltip title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
              <IconButton size="small" onClick={onToggleTheme} color="primary">
                {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton size="small" onClick={onLogout} color="primary">
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {TABS.map((tab, index) => (
            <Tab
              key={tab.key}
              label={tab.label}
              icon={TAB_ICONS[index]}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 1 }}>
        <TabPanel value={activeTab} index={0}>
          <ChatIntegrationTab username={username} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <VulnerableTab username={username} />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <GuardedTab username={username} />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <TicketsTab />
        </TabPanel>
      </Container>
    </Box>
  );
}