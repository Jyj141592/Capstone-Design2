export const mockProfile = {
  avatarUrl: "/images/avatar_default.jpg",
  name: "이름",
  age: 60,
  gender: "남",
  region: "서울",
  interests: ["건강", "치매"],
};

export const mockMyClubs = [
  {
    id: 1,
    name: "골프 매니아",
    category: "골프",
    description: "골프 이야기",
    current: 19,
    max: 30,
    imageUrl: "/images/club-golf.jpg",
  },
  {
    id: 2,
    name: "꿈꾸는 발자국",
    category: "걷기/러닝/마라톤",
    description: "트레킹,달리기,걷기",
    current: 9,
    max: 20,
    imageUrl: "/images/club-running.jpg",
  },
  {
    id: 3,
    name: "등산 모임",
    category: "등산",
    description: "산을 좋아하시는 분들",
    current: 88,
    max: 90,
    imageUrl: "/images/club-mountains.jpg",
  },
];

export const mockGuardians = [
  { id: 1, name: "보호자1", avatarUrl: "/images/avatar_default.jpg" },
  { id: 2, name: "보호자2", avatarUrl: "/images/avatar_default.jpg" },
  { id: 3, name: "보호자3", avatarUrl: "/images/avatar_default.jpg" },
  { id: 4, name: "보호자4", avatarUrl: "/images/avatar_default.jpg" },
];

/* + clubregister */
export const mockProteges = [
  { id: 1, name: "피보호자1", avatarUrl: "/images/avatar_default.jpg" },
  { id: 2, name: "피보호자2", avatarUrl: "/images/avatar_default.jpg" },
  { id: 3, name: "피보호자3", avatarUrl: "/images/avatar_default.jpg" },
];

export const mockManageClubs = {
  my: ["모임 이름 1", "모임 이름 2", "모임 이름 3", "모임 이름 4"],
  pending: ["모임 이름 5", "모임 이름 6"],
  rejected: ["모임 이름 8", "모임 이름 9"],
};

export const mockManageGuardians = [
  { id: 1, name: "보호자1", avatarUrl: "/images/avatar_default.jpg" },
  { id: 2, name: "보호자2", avatarUrl: "/images/avatar_default.jpg" },
  { id: 3, name: "보호자3", avatarUrl: "/images/avatar_default.jpg" },
  { id: 4, name: "보호자4", avatarUrl: "/images/avatar_default.jpg" },
];

export const mockManageProteges = [
  { id: 1, name: "피보호자1", avatarUrl: "/images/avatar_default.jpg" },
  { id: 2, name: "피보호자2", avatarUrl: "/images/avatar_default.jpg" },
  { id: 3, name: "피보호자3", avatarUrl: "/images/avatar_default.jpg" },
];

export const mockActivities = {
  1: [
    {
      id: 1,
      title: "정기 라운딩",
      date: "2025-04-01",
      content: "봄맞이 정기 라운딩을 진행했습니다.",
    },
    {
      id: 2,
      title: "초보자 교육",
      date: "2025-03-20",
      content: "신규 가입자들을 위한 스윙 기초 교육을 진행했습니다.",
    },
  ],
  2: [
    {
      id: 1,
      title: "트레킹 모임",
      date: "2025-04-03",
      content: "한강변 트레킹 10km를 함께 걸었습니다.",
    },
    {
      id: 2,
      title: "러닝 클래스",
      date: "2025-03-15",
      content: "기초 러닝 자세를 배우는 수업을 열었습니다.",
    },
  ],
  3: [
    {
      id: 1,
      title: "등산 정모",
      date: "2025-04-05",
      content: "관악산을 함께 등반했습니다.",
    },
    {
      id: 2,
      title: "등산 장비 워크숍",
      date: "2025-03-22",
      content: "배낭, 신발, 스틱 등 장비 소개 및 실습을 진행했습니다.",
    },
  ],
};

export const mockNotices = {
  1: "1 가입 시 주의사항",
  2: "2 가입 시 주의사항",
  3: "3 가입 시 주의사항",
};
