import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Timeline,
  TrendingUp,
  Group,
  AttachMoney,
  Event,
  Assessment,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ManagementPage = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const stats = {
    totalAppointments: 1234,
    medianAge: 45,
    totalRevenue: 52460,
    monthlyGrowth: 12.5,
    activePatients: 856,
    appointmentCompletionRate: 92,
  };

  const revenueData = [
    { month: "Jan", revenue: 4200 },
    { month: "Feb", revenue: 4800 },
    { month: "Mar", revenue: 5100 },
    { month: "Apr", revenue: 4900 },
    { month: "May", revenue: 5400 },
    { month: "Jun", revenue: 5800 },
  ];

  const ageDistribution = [
    { name: "18-30", value: 25 },
    { name: "31-45", value: 35 },
    { name: "46-60", value: 25 },
    { name: "60+", value: 15 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f7fb", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Practice Management
          </Typography>
          <Typography color="text.secondary">
            Overview of your practice performance and analytics
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              title: "Total Appointments",
              value: stats.totalAppointments,
              icon: <Event sx={{ fontSize: 40 }} />,
              color: "#1976d2",
            },
            {
              title: "Median Patient Age",
              value: `${stats.medianAge} years`,
              icon: <Group sx={{ fontSize: 40 }} />,
              color: "#2e7d32",
            },
            {
              title: "Total Revenue",
              value: `€${stats.totalRevenue.toLocaleString()}`,
              icon: <AttachMoney sx={{ fontSize: 40 }} />,
              color: "#ed6c02",
            },
            {
              title: "Monthly Growth",
              value: `${stats.monthlyGrowth}%`,
              icon: <TrendingUp sx={{ fontSize: 40 }} />,
              color: "#9c27b0",
            },
          ].map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: `${metric.color}15`,
                        color: metric.color,
                      }}
                    >
                      {metric.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    {metric.value}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {metric.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="h6">Revenue Overview</Typography>
                <ButtonGroup size="small">
                  {["week", "month", "year"].map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "contained" : "outlined"}
                      onClick={() => setTimeRange(range as any)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
              <Box sx={{ height: 300 }}>
                <LineChart
                  width={800}
                  height={300}
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </Box>
            </Card>
          </Grid>

          {/* Age Distribution */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Patient Age Distribution
              </Typography>
              <Box
                sx={{ height: 300, display: "flex", justifyContent: "center" }}
              >
                <PieChart width={300} height={300}>
                  <Pie
                    data={ageDistribution}
                    cx={150}
                    cy={150}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ageDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ManagementPage;
