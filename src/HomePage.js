import { Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CombinedHealthImage from "./assets/CombinedHealthImage.jpg";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Background Image Section */}
      <Box
        sx={{
          width: "100vw",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${CombinedHealthImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            width: "90%",
            maxWidth: 400,
            textAlign: "center",
            backgroundColor: "transparent",
            borderRadius: 3,
            marginTop: "250px",
          }}
        >
          {/* <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome
        </Typography>
        <Typography variant="body1" gutterBottom>
          Choose an option below:
        </Typography> */}
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2, fontSize: "1rem", padding: "10px" }}
              onClick={() => navigate("/get-quotation")}
            >
              Get Best Plan
            </Button>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ fontSize: "1rem", padding: "10px" }}
                onClick={() => navigate("/agent-registration")}
              >
                Agent Sign Up
              </Button>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ fontSize: "1rem", padding: "10px", mt: 2 }}
                onClick={() => navigate("/agent-login")}
              >
                Agent Reports
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* Quote Section */}
      <Box
        sx={{
          textAlign: "center",
          //padding: "20px",
          backgroundColor: "#f5f5f5", // Light background for contrast
          minHeight: "15vh", // To ensure it takes the remaining space
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" fontStyle="italic" fontWeight="bold">
          "Accidents are unpredictable, which is why we insure against them—to
          protect our loved ones."
        </Typography>
        <Typography
          variant="h6"
          fontStyle="italic"
          fontWeight="bold"
          sx={{ padding: "10px" }}
        >
          "But as we age, health challenges are certain. Have we secured our
          family from the financial burden they bring?"
        </Typography>
        <Typography variant="h6" fontStyle="italic" fontWeight="bold">
          ""Peace of mind comes from knowing you're covered. Insure your health,
          insure your future.""
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;
