"use client";
import SearchBox from "@/components/SearchBox";
import { Container, keyframes, Typography } from "@mui/material";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;
export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
          background: "linear-gradient(90deg, #dc2626, #2563eb)", // red to blue gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `${fadeInUp} 1s ease-out forwards`,
        }}
        textAlign={"center"}
      >
        Welcome to Beautiful Nepal
      </Typography>
      <Typography variant="h6" className="mt-2 text-center">
        Discover the beauty of Nepal through our curated travel guides and experiences.
      </Typography>
      <div className="p-6">
        <SearchBox />
      </div>
    </Container>
  );
}
