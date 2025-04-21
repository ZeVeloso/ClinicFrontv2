import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  AccessTime,
  Phone,
  Email,
  LocationOn,
  Check,
  Timeline,
  Security,
} from "@mui/icons-material";
import { useAppNavigation } from "@hooks/useAppNavigation";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const { toAppointments } = useAppNavigation();

  const features = [
    {
      title: "Online Booking",
      description: "Schedule appointments your patients appointments",
      icon: <AccessTime />,
    },
    {
      title: "Secure Platform",
      description:
        "Your patients data is protected with the highest security standards",
      icon: <Security />,
    },
    {
      title: "Patient History",
      description: "Access your appointments history in one place",
      icon: <Timeline />,
    },
  ];

  const pricingPlans = [
    {
      title: "2 Week Free Trial",
      price: "$0",
      features: [
        "Patient Appointment",
        "Appointment Reminder",
        "Money Management",
      ],
    },
    {
      title: "Plan",
      price: "$10",
      features: [
        "Patient Appointment",
        "Appointment Reminder",
        "Money Management",
      ],
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          mb: 6,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.05)",
            transform: "skewY(-5deg)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ animation: "fadeIn 1s ease-out" }}>
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Your Health, Our Priority
                </Typography>
                <Typography variant="h5" paragraph sx={{ mb: 4 }}>
                  Effortless Appointment Management, Anytime, Anywhere.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => toAppointments()}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    boxShadow: "0 4px 14px 0 rgba(0,0,0,0.2)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                      transition: "all 0.2s ease-in-out",
                    },
                  }}
                >
                  Book Appointment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box
                    sx={{
                      mb: 3,
                      color: "primary.main",
                      transform: "scale(1.5)",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Pricing Plans
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {pricingPlans.map((plan) => (
              <Grid item xs={12} md={6} key={plan.title}>
                <Card
                  elevation={3}
                  sx={{
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {/* {index === 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        bgcolor: "secondary.main",
                        color: "white",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      Popular
                    </Box>
                  )} */}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                      {plan.title}
                    </Typography>
                    <Typography variant="h3" color="primary" gutterBottom>
                      {plan.price}
                    </Typography>
                    <List>
                      {plan.features.map((feature) => (
                        <ListItem key={feature}>
                          <ListItemIcon>
                            <Check color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => toAppointments()}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Contact Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            { icon: <Phone />, title: "Phone", content: "+1 (555) 123-4567" },
            {
              icon: <Email />,
              title: "Email",
              content: "contact@healthclinic.com",
            },
            {
              icon: <LocationOn />,
              title: "Location",
              content: "123 Health Street, Medical City, MC 12345",
            },
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "grey.50",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box
                  sx={{
                    color: "primary.main",
                    display: "inline-flex",
                    p: 2,
                    borderRadius: "50%",
                    mb: 2,
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 40 } })}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.content}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
