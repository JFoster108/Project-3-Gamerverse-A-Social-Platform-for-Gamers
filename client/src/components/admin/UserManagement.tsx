// src/components/admin/UserManagement.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  width: 250px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.borderColor};
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primaryColor};
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const BanButton = styled(ActionButton)`
  color: ${({ theme }) => theme.dangerColor};
`;

const UserTag = styled.span<{ role: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) =>
    props.role === "admin"
      ? props.theme.dangerColor
      : props.role === "moderator"
      ? props.theme.warningColor
      : props.theme.tagBackground};
  color: ${(props) =>
    props.role === "admin" || props.role === "moderator"
      ? "white"
      : props.theme.tagText};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: 1px solid
    ${(props) =>
      props.active ? props.theme.primaryColor : props.theme.borderColor};
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? props.theme.primaryColor : "transparent"};
  color: ${(props) => (props.active ? "white" : props.theme.textColor)};
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.active
        ? props.theme.primaryColorDark
        : props.theme.backgroundHover};
  }
`;

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "banned";
  joinedDate: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    // Mock user data - in a real app, you'd fetch this from your API
    const mockUsers: User[] = [
      {
        id: "1",
        username: "admin",
        email: "admin@gamerverse.com",
        role: "admin",
        status: "active",
        joinedDate: "2023-01-01",
      },
      {
        id: "2",
        username: "moderator1",
        email: "mod1@gamerverse.com",
        role: "moderator",
        status: "active",
        joinedDate: "2023-01-15",
      },
      {
        id: "3",
        username: "gamer123",
        email: "gamer123@example.com",
        role: "user",
        status: "active",
        joinedDate: "2023-02-10",
      },
      {
        id: "4",
        username: "banneduser",
        email: "banned@example.com",
        role: "user",
        status: "banned",
        joinedDate: "2023-03-05",
      },
    ];

    // Generate more mock users
    for (let i = 5; i <= 30; i++) {
      mockUsers.push({
        id: i.toString(),
        username: `user${i}`,
        email: `user${i}@example.com`,
        role: "user",
        status: "active",
        joinedDate: "2023-04-01",
      });
    }

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchQuery, users]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle user actions
  const handleBanUser = (userId: string) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      // In a real app, you'd call your API
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === "active" ? "banned" : "active",
              }
            : user
        )
      );
    }
  };

  const handleRoleChange = (
    userId: string,
    newRole: "user" | "moderator" | "admin"
  ) => {
    if (
      window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      // In a real app, you'd call your API
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    }
  };

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Joined</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>
                <UserTag role={user.role}>{user.role}</UserTag>
              </Td>
              <Td>{user.status}</Td>
              <Td>{new Date(user.joinedDate).toLocaleDateString()}</Td>
              <Td>
                <ActionButton
                  onClick={() =>
                    handleRoleChange(
                      user.id,
                      user.role === "user" ? "moderator" : "user"
                    )
                  }
                >
                  {user.role === "user" ? "Make Moderator" : "Remove Moderator"}
                </ActionButton>
                <BanButton onClick={() => handleBanUser(user.id)}>
                  {user.status === "active" ? "Ban User" : "Unban User"}
                </BanButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({
          length: Math.ceil(filteredUsers.length / usersPerPage),
        }).map((_, index) => (
          <PageButton
            key={index}
            active={currentPage === index + 1}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </PageButton>
        ))}
      </Pagination>
    </Container>
  );
};

export default UserManagement;
