import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
} from "@mui/material";
import { TrendingUp, Group, AttachMoney, Event } from "@mui/icons-material";
import {
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
import { fetchManagementStats, fetchRevenueData } from "../api/management";
import { ManagementStats, Revenue } from "../features/management/types";
import { CircularProgress, Alert, Skeleton } from "@mui/material";
import React from "react";

const ManagementPage = () => {
  const [timeRange, setTimeRange] = useState<"year">("year");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<ManagementStats>({
    stats: {
      totalAppointments: 0,
      medianAge: 0,
      totalRevenue: 0,
      activePatients: 0,
      appointmentCompletionRate: 0,
    },
    ageDistribution: [] as { name: string; value: number }[],
  });
  const [revenueData, setRevenueData] = useState<Array<Revenue>>([]);

  // Update useEffect to fetch both stats and revenue
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, revenueResponse] = await Promise.all([
          fetchManagementStats(),
          fetchRevenueData(timeRange),
        ]);
        setData(statsResponse);
        setRevenueData(revenueResponse.data);
      } catch (err) {
        setError("Failed to load management data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Update the metrics to use real data

  const COLORS = ["#C0C0C0", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <Box sx={{ padding: 3, backgroundColor: "#f5f7fb", minHeight: "100vh" }}>
        <Grid container spacing={3}>
          {/* Skeleton for metrics */}
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" sx={{ mt: 2, height: 40 }} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
          {/* Skeleton for charts */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, height: "400px" }}>
              <Skeleton variant="rectangular" height="100%" />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: "400px" }}>
              <Skeleton variant="circular" width="100%" height="100%" />
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              RETRY
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }
  const metrics = [
    {
      title: "Total Appointments",
      value: data.stats.totalAppointments,
      icon: <Event sx={{ fontSize: 40 }} />,
      color: "#1976d2",
    },
    {
      title: "Median Patient Age",
      value: `${data.stats.medianAge} years`,
      icon: <Group sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
    },
    {
      title: "Total Revenue",
      value: `€${data.stats.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
    },
    {
      title: "Completion Rate",
      value: `${data.stats.appointmentCompletionRate}%`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#9c27b0",
    },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f7fb", minHeight: "100vh" }}>
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
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: (theme) => theme.shadows[4],
                },
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
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h6">Revenue Overview</Typography>
              <ButtonGroup size="small">
                {["year"].map((range) => (
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
            <Box sx={{ height: 300, width: "100%", overflowX: "auto" }}>
              <LineChart
                width={800}
                height={290}
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
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Patient Age Distribution
            </Typography>
            <Box
              sx={{
                height: { xs: 250, sm: 300 },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PieChart width={300} height={300}>
                <Pie
                  data={data.ageDistribution}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.ageDistribution.map((_, index) => (
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
    </Box>
  );
};

export default ManagementPage;
