import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";

const Profile = () => {
  const { username } = useParams<{ username: string }>();

  // Mock user data (would come from API in real implementation)
  const userData = {
    username: username || "gamer123",
    avatarUrl: "https://via.placeholder.com/150",
    bio: "Passionate gamer since the NES days. I love RPGs, adventure games, and the occasional FPS.",
    joinedDate: "January 2023",
    friendCodes: {
      nintendo: "SW-1234-5678-9012",
      playstation: "gamerlover123",
      xbox: "gamerlover123",
      steam: "gamerlover123",
    },
    stats: {
      posts: 42,
      games: 37,
      completed: 24,
    },
  };

  // Mock game collection data
  const gameCollection = [
    {
      id: "1",
      title: "The Legend of Zelda: Tears of the Kingdom",
      coverUrl: "https://via.placeholder.com/150",
      platform: "Nintendo Switch",
      status: "Completed",
    },
    {
      id: "2",
      title: "God of War Ragnarök",
      coverUrl: "https://via.placeholder.com/150",
      platform: "PlayStation 5",
      status: "Now Playing",
    },
    {
      id: "3",
      title: "Elden Ring",
      coverUrl: "https://via.placeholder.com/150",
      platform: "PC",
      status: "Completed",
    },
  ];

  return (
    <Container>
      <ProfileHeader>
        <AvatarSection>
          <Avatar src={userData.avatarUrl} alt={userData.username} />
          <EditButton to="/profile/edit">Edit Profile</EditButton>
        </AvatarSection>

        <ProfileInfo>
          <Username>{userData.username}</Username>
          <JoinDate>Member since {userData.joinedDate}</JoinDate>
          <Bio>{userData.bio}</Bio>

          <StatsGrid>
            <Stat>
              <StatValue>{userData.stats.posts}</StatValue>
              <StatLabel>Posts</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{userData.stats.games}</StatValue>
              <StatLabel>Games</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{userData.stats.completed}</StatValue>
              <StatLabel>Completed</StatLabel>
            </Stat>
          </StatsGrid>
        </ProfileInfo>
      </ProfileHeader>

      <SectionDivider />

      <GamingProfiles>
        <SectionTitle>Gaming Profiles</SectionTitle>
        <ProfilesList>
          <ProfileItem>
            <ProfilePlatform>Nintendo Switch:</ProfilePlatform>
            <ProfileValue>{userData.friendCodes.nintendo}</ProfileValue>
          </ProfileItem>
          <ProfileItem>
            <ProfilePlatform>PlayStation Network:</ProfilePlatform>
            <ProfileValue>{userData.friendCodes.playstation}</ProfileValue>
          </ProfileItem>
          <ProfileItem>
            <ProfilePlatform>Xbox:</ProfilePlatform>
            <ProfileValue>{userData.friendCodes.xbox}</ProfileValue>
          </ProfileItem>
          <ProfileItem>
            <ProfilePlatform>Steam:</ProfilePlatform>
            <ProfileValue>{userData.friendCodes.steam}</ProfileValue>
          </ProfileItem>
        </ProfilesList>
      </GamingProfiles>

      <SectionDivider />

      <GameCollection>
        <SectionTitle>Game Collection</SectionTitle>
        <GamesGrid>
          {gameCollection.map((game) => (
            <GameCard key={game.id}>
              <GameCover src={game.coverUrl} alt={game.title} />
              <GameInfo>
                <GameTitle>{game.title}</GameTitle>
                <GamePlatform>{game.platform}</GamePlatform>
                <GameStatus status={game.status}>{game.status}</GameStatus>
              </GameInfo>
            </GameCard>
          ))}
        </GamesGrid>
      </GameCollection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ProfileHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

const EditButton = styled(Link)`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Username = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const JoinDate = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Bio = styled.p`
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatsGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const GamingProfiles = styled.div``;

const ProfilesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const ProfilePlatform = styled.span`
  font-weight: 600;
`;

const ProfileValue = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GameCollection = styled.div``;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const GameCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const GameCover = styled.img`
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
`;

const GameInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const GameTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GamePlatform = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

interface GameStatusProps {
  status: string;
}

const GameStatus = styled.span<GameStatusProps>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme, status }) => {
    switch (status) {
      case "Now Playing":
        return `${theme.colors.primary}20`;
      case "Completed":
        return `${theme.colors.success}20`;
      case "On Hold":
        return `${theme.colors.warning}20`;
      case "Dropped":
        return `${theme.colors.error}20`;
      default:
        return `${theme.colors.info}20`;
    }
  }};
  color: ${({ theme, status }) => {
    switch (status) {
      case "Now Playing":
        return theme.colors.primary;
      case "Completed":
        return theme.colors.success;
      case "On Hold":
        return theme.colors.warning;
      case "Dropped":
        return theme.colors.error;
      default:
        return theme.colors.info;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
`;

export default Profile;
