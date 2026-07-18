import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
      const response = await axiosInstance.post('/api/auth/signup', signupData);
      // Store token in localStorage for backup auth
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    };
    
export const login = async (loginData) => {
      const response = await axiosInstance.post('/api/auth/login', loginData);
      // Store token in localStorage for backup auth
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    };
export const logout = async () => {
      localStorage.removeItem('authToken');
      const response = await axiosInstance.post('/api/auth/logout');
      return response.data;
    };

export const getAuthUser = async () => {
      const response = await axiosInstance.get('/api/auth/me');
      return response.data;
    };

export const completeOnboarding = async (userData) => {
      const response = await axiosInstance.post('/api/auth/onboarding', userData);
      return response.data;
    }

export const updateProfile = async (userData) => {
      const response = await axiosInstance.put('/api/auth/profile', userData);
      return response.data;
    }

export async function getUserFriends() {
      const response = await axiosInstance.get('/api/users/friends');
      return response.data;
    }
export async function getRecommendedUsers() {
      const response = await axiosInstance.get('/api/users');
      return response.data;
    }
export async function getOutgoingFriendReqs() {
      const response = await axiosInstance.get('/api/users/outgoing-friend-request');
      return response.data.outgoingRequests || [];
    }
export async function sendFriendRequest(userId) {
      const response = await axiosInstance.post(`/api/users/friend-request/${userId}`);
      return response.data;
    }
export async function getFriendRequests() {
      const response = await axiosInstance.get('/api/users/friend-request');
      return response.data;
    }
export async function acceptFriendRequest(requestId) {
      const response = await axiosInstance.put(`/api/users/friend-request/${requestId}/accept`);
      return response.data;
    }
export async function getStreamToken() {
      const response = await axiosInstance.get('/api/chat/token');
      return response.data;
    }

// ============= GROUP API FUNCTIONS =============

export async function createGroup(groupData) {
      const response = await axiosInstance.post('/api/groups', groupData);
      return response.data;
    }

export async function getMyGroups() {
      const response = await axiosInstance.get('/api/groups');
      return response.data;
    }

export async function getGroupById(groupId) {
      const response = await axiosInstance.get(`/api/groups/${groupId}`);
      return response.data;
    }

export async function updateGroup(groupId, groupData) {
      const response = await axiosInstance.put(`/api/groups/${groupId}`, groupData);
      return response.data;
    }

export async function deleteGroup(groupId) {
      const response = await axiosInstance.delete(`/api/groups/${groupId}`);
      return response.data;
    }

export async function addGroupMembers(groupId, memberIds) {
      const response = await axiosInstance.post(`/api/groups/${groupId}/members`, { memberIds });
      return response.data;
    }

export async function removeGroupMember(groupId, memberId) {
      const response = await axiosInstance.delete(`/api/groups/${groupId}/members/${memberId}`);
      return response.data;
    }

export async function leaveGroup(groupId, userId) {
      const response = await axiosInstance.delete(`/api/groups/${groupId}/members/${userId}`);
      return response.data;
    }

// ============= ROOM API FUNCTIONS =============

export async function createRoom(roomData) {
  const response = await axiosInstance.post('/api/rooms/create', roomData);
  return response.data;
}

export async function getPublicRooms(meetingType = null) {
  const params = meetingType ? { meetingType } : {};
  const response = await axiosInstance.get('/api/rooms/public', { params });
  return response.data;
}

export async function getRoomById(roomId) {
  const response = await axiosInstance.get(`/api/rooms/${roomId}`);
  return response.data;
}

export async function joinRoom(roomId, password = null) {
  const response = await axiosInstance.post(`/api/rooms/${roomId}/join`, { password });
  return response.data;
}

export async function joinByRoomCode(roomCode, password = null) {
  const response = await axiosInstance.post(`/api/rooms/join-by-code/${roomCode}`, { password });
  return response.data;
}

export async function admitFromWaitingRoom(roomId, userId) {
  const response = await axiosInstance.post(`/api/rooms/${roomId}/admit`, { userId });
  return response.data;
}

export async function leaveRoom(roomId) {
  const response = await axiosInstance.post(`/api/rooms/${roomId}/leave`);
  return response.data;
}

export async function deleteRoom(roomId) {
  const response = await axiosInstance.delete(`/api/rooms/${roomId}`);
  return response.data;
}

export async function getMyRooms() {
  const response = await axiosInstance.get('/api/rooms/my-rooms');
  return response.data;
}

export async function createDirectCallLink(callData) {
  const response = await axiosInstance.post('/api/rooms/direct-call/create', callData);
  return response.data;
}
