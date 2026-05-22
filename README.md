# KAIST GIS 통합관제 플랫폼 — 메인 (대시보드 + 백엔드)

> **한 줄 소개**  
> KAIST 캠퍼스 내 사건·사고를 **지도 위에서 실시간으로 확인·처리·관리**하는 GIS 기반 웹 관제 플랫폼의 **메인 모듈**입니다. 운영자가 브라우저로 접속하는 대시보드와 그 백엔드 API를 포함합니다.

---

## 🏛️ 전체 시스템 구성

이 저장소는 **KAIST GIS 통합관제 플랫폼**을 구성하는 여러 저장소 중 **메인 모듈**입니다. 클릭하면 다른 모듈 저장소로 이동합니다.

| 모듈 | 역할 | 저장소 |
|---|---|---|
| 🖥️ **GIS 메인 (이 저장소)** | 관제 화면 + 시설·이벤트·순찰 API | **kaist-gis-campus** *(현재)* |
| 🔥 화재 이벤트 수집 모듈 | 외부 화재 시스템과 TCP 연동 | [ibs-fire-module](https://github.com/Udeng96/ibs-fire-module) |
| 💨 가스 이벤트 수집 모듈 | 외부 가스 DB에서 polling | [gasModule](https://github.com/Udeng96/gasModule) |
| 🔆 불꽃 감지 모듈 | _(추가 예정)_ | _(추가 예정)_ |

### 시스템 아키텍처

```
┌────────────────────────────────────────────────────────────┐
│             KAIST 캠퍼스 관제 운영자 (브라우저)                │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTPS / WebSocket(STOMP)
                           ▼
┌────────────────────────────────────────────────────────────┐
│  🖥️  GIS 메인 (이 저장소 · kaist-gis-campus)                  │
│      React 18 + TypeScript + Vite + Spring Boot            │
│      • Leaflet GIS 지도, 패널 UI                              │
│      • 시설(건물·CCTV·센서)·이벤트·순찰 REST API                 │
│      • WebRTC 기반 CCTV 영상 표출                              │
└────────▲─────────────────▲──────────────────────▲──────────┘
         │ WS push         │ WS push              │ WS push
┌────────┴───────┐ ┌───────┴────────┐  ┌──────────┴─────────┐
│  🔥 화재 모듈    │ │  💨 가스 모듈     │  │  🔆 불꽃 감지 모듈    │
│ ibs-fire-module│ │   gasModule    │  │   (추가 예정)         │
└────────▲───────┘ └───────▲────────┘  └────────────────────┘
         │ TCP             │ DB Polling
┌────────┴───────┐ ┌───────┴────────┐
│ 외부 화재 시스템   │ │ 외부 가스 DB     │
│  (TCP 서버)     │ │  (MSSQL)       │
└────────────────┘ └────────────────┘
```

---

## 🎯 무엇을 위한 시스템인가요?

KAIST 캠퍼스 내에서 **화재·가스·불꽃 같은 사건·사고가 발생했을 때 관제실 운영자가 즉시 인지하고 대응**할 수 있도록 만든 시스템입니다.  
캠퍼스 지도 위에 모든 건물·CCTV·센서가 표시되고, 외부 모듈(화재·가스·불꽃)에서 이벤트가 발생하면 **실시간으로 지도에 알림이 뜨고 CCTV 영상을 바로 확인**할 수 있습니다.

---

## 🖥️ 화면 구성

**"중앙 지도 + 좌우 패널"** 구조의 단일 대시보드 화면입니다.

- **중앙 (지도)**: KAIST 캠퍼스 지도 (Leaflet + proj4leaflet 좌표 변환) - 건물·CCTV·센서 마커
- **좌측 패널**: 캠퍼스/구역 선택, 건물 목록
- **우측 패널**: 선택한 건물의 상세 정보, 이벤트 발생 현황, CCTV 영상 (WebRTC)
- **상단바**: 날씨, 기능 메뉴

---

## 🛠️ 주요 기능

### 1. 캠퍼스 구역 및 건물별 관제

![메인 대시보드 화면](screenshot-main.png)

- **Leaflet 기반 캠퍼스 GIS 지도** 위 건물·CCTV·센서 마커 표시
- **proj4leaflet으로 좌표계 변환** (캠퍼스 자체 좌표계 ↔ 지도 표준 좌표계)
- 건물 선택 → 해당 건물의 CCTV·센서·이벤트 현황 즉시 확인
- 즐겨찾기 기능으로 자주 보는 건물·CCTV 빠른 접근

### 2. 건물별 발생 이벤트 관리

- **화재·가스·불꽃 이벤트를 STOMP WebSocket으로 실시간 수신**
- 발생한 이벤트를 지도에 즉시 표출, 상세 정보 조회
- 이벤트 처리 완료 시 클리어 처리
- 이벤트 이력 검색·조회 (날짜·유형·건물별)

### 3. CCTV 순찰 모드

- **지정한 CCTV들을 일정 주기로 자동 전환하며 모니터링**
- 순찰 코스 등록·수정·삭제 (CRUD)
- 코스별 CCTV 매핑 관리
- **WebRTC 기반 실시간 CCTV 영상 재생**

---

## 👤 담당 역할 (단독 개발)

- **외부 이벤트 데이터 연계 모듈** 및 데이터 조회 API 개발 (화재 TCP / 가스 DB polling)
- **GIS 대시보드 프론트엔드 개발** (React + TypeScript + Leaflet + Zustand)
- **사내 WebRTC 기능 개선** — CCTV 실시간 영상 표출 안정성 향상
- **디자인·기획 회의 참여**
- 전체 4개 저장소(이 저장소 + 화재/가스/불꽃 모듈) **단독 개발**

---

## 🧱 사용한 기술

| 영역 | 기술 |
|---|---|
| 백엔드 언어/프레임워크 | Java, Spring Boot |
| 백엔드 라이브러리 | Spring Data JPA, Spring WebSocket (STOMP) |
| 데이터베이스 | PostgreSQL |
| 프론트 언어/프레임워크 | React 18, TypeScript |
| 빌드 도구 | **Vite** |
| 상태관리 | **Zustand** |
| 지도(GIS) | Leaflet + react-leaflet + **proj4leaflet** (좌표계 변환) |
| 실시간 통신 | **STOMP over WebSocket** (이벤트 수신) |
| 영상 스트리밍 | **WebRTC** (CCTV) |
| HTTP 클라이언트 | Axios |

---

## 📂 전체 폴더 구조

```
kaist-gis-campus/
├── src/main/java/com/eseict/kaist/    # 백엔드 (Spring Boot)
│   ├── fac/           ⭐ 시설 관리 (건물·CCTV·센서)
│   │   ├── controller/      — 시설 API (FacController)
│   │   ├── service/         — 조회(query) / 명령(command) 서비스 분리
│   │   ├── data/            — VO·DTO·Repository
│   │   └── ...
│   ├── event/         ⭐ 이벤트 관리 (화재·가스·불꽃 로그 통합)
│   │   ├── controller/      — 이벤트 API (EventController)
│   │   ├── service/         — 유형별 로그 서비스 (FireService, GasService, FlameService)
│   │   └── data/            — 이벤트·이력 VO/DTO
│   ├── patrol/        ⭐ CCTV 순찰 모드
│   │   ├── controller/      — 순찰 API (PatrolController)
│   │   ├── service/         — 순찰 로직
│   │   └── data/            — 순찰·매핑 VO
│   ├── common/        — 공통 (기상 정보 등)
│   ├── data/dto/      — 공용 응답 형식
│   ├── config/        — DB·앱 설정
│   └── KaistApplication.java
│
├── front/                              # 프론트엔드 (React 18 + Vite)
│   └── src/
│       ├── components/
│       │   ├── topbar/      — 상단바 (날씨 등)
│       │   └── main/
│       │       ├── gis/     ⭐ Leaflet 지도 (캠퍼스 마커)
│       │       └── panel/
│       │           ├── left/        — 좌측 패널 (캠퍼스·건물 선택)
│       │           └── right/       — 우측 패널 (이벤트·CCTV)
│       │               ├── campus/  — 캠퍼스/이벤트 탭
│       │               └── common/  — CCTV 플레이어
│       ├── api/             — 백엔드 API 호출 (axios)
│       ├── data/            — 상수·타입
│       ├── store/           — Zustand 상태 저장소
│       └── assets/          — 이미지·CSS·폰트
│
├── pom.xml          — 백엔드 의존성 (Maven)
├── front/package.json — 프론트 의존성 (npm/Vite)
└── README.md        — 이 문서
```

> ⭐ 표시: 코드를 처음 볼 때 가장 먼저 열어보면 좋은 곳

---

## 🗺️ 기능 → 코드 위치 매핑

**파일/폴더명을 클릭하면 GitHub에서 바로 해당 위치로 이동합니다.**

### 백엔드 (서버)

| 기능 | 어떤 역할을 하는지 | 핵심 파일 |
|---|---|---|
| **시설 정보 API** | 건물·CCTV·센서 목록과 상세 정보를 화면에 내려줌, 즐겨찾기 등록·CCTV CRUD | [FacController.java](src/main/java/com/eseict/kaist/fac/controller/FacController.java) |
| 시설 조회 로직 | 건물·CCTV·센서별 조회 서비스 (CQRS 패턴, query 분리) | [fac/service/query/](src/main/java/com/eseict/kaist/fac/service/query) |
| 시설 명령 로직 | CCTV 등록·수정·삭제 등 변경 작업 | [fac/service/command/](src/main/java/com/eseict/kaist/fac/service/command) |
| **이벤트 API** | 발생한 이벤트(화재·가스·불꽃) 조회, 새 이벤트 등록, 처리 완료 클리어 | [EventController.java](src/main/java/com/eseict/kaist/event/controller/EventController.java) |
| 이벤트 유형별 로그 처리 | 화재/가스/불꽃 각각의 로그를 분리해서 관리 | [event/service/command/log/](src/main/java/com/eseict/kaist/event/service/command/log) |
| **CCTV 순찰 API** | 순찰 코스 CRUD, 코스별 CCTV 매핑 관리 | [PatrolController.java](src/main/java/com/eseict/kaist/patrol/controller/PatrolController.java) |
| 기상 정보 API | 캠퍼스 지역 날씨 정보 (상단바 표시용) | [WeatherController.java](src/main/java/com/eseict/kaist/common/controller/WeatherController.java) |
| 공통 코드 API | 화면 곳곳에서 쓰는 공용 코드/타입 정보 | [CommonController.java](src/main/java/com/eseict/kaist/common/controller/CommonController.java) |

### 프론트엔드 (화면)

| 화면/기능 | 어떤 역할을 하는지 | 핵심 폴더·파일 |
|---|---|---|
| **앱 진입점** | React 앱 시작, 라우터·Store 마운트 | [front/src/main.tsx](front/src/main.tsx) |
| **상단바** | 캠퍼스 선택, 날씨 등 화면 최상단 영역 | [components/topbar/](front/src/components/topbar) |
| **GIS 지도 (Leaflet)** | 캠퍼스 지도 렌더링, 건물·CCTV·센서 마커 표시 | [components/main/gis/gis.tsx](front/src/components/main/gis/gis.tsx) |
| **좌측 패널** | 캠퍼스 선택, 건물 목록 표시 | [components/main/panel/left/](front/src/components/main/panel/left) |
| **우측 패널** | 선택한 건물의 상세 정보·이벤트·CCTV 표시 | [components/main/panel/right/](front/src/components/main/panel/right) |
| └ 캠퍼스/이벤트 탭 | 캠퍼스 정보와 발생 이벤트 목록 | [right/campus/](front/src/components/main/panel/right/campus) |
| └ **CCTV 플레이어 (WebRTC)** | 선택한 CCTV의 실시간 영상 재생 | [right/common/cctvPlayerBox.tsx](front/src/components/main/panel/right/common/cctvPlayerBox.tsx) |
| **STOMP WebSocket 구독** | 화재·가스·불꽃 모듈에서 push 되는 이벤트를 실시간 수신 | [websocket_back/stomp/](front/src/websocket_back/stomp) |
| **백엔드 API 호출** | axios 기반 REST API 클라이언트 | [front/src/api/](front/src/api) |
| **Zustand Store** | 화면 상태(선택 건물, 활성 탭 등) 보관 | [front/src/data/](front/src/data) |

---

## 🔍 처음 코드를 보는 분께 — 추천 탐색 순서

1. **[front/src/main.tsx](front/src/main.tsx)** — 프론트 앱 진입점
2. **[components/main/gis/gis.tsx](front/src/components/main/gis/gis.tsx)** — Leaflet 지도 + 마커 표출 핵심
3. **[FacController.java](src/main/java/com/eseict/kaist/fac/controller/FacController.java)** — 화면이 부르는 시설 API
4. **[EventController.java](src/main/java/com/eseict/kaist/event/controller/EventController.java)** — 이벤트 등록/조회 API
5. **[websocket_back/stomp/](front/src/websocket_back/stomp)** — 외부 모듈에서 오는 실시간 이벤트 수신 처리
6. 화재·가스 이벤트의 **원천 데이터 흐름**이 궁금하면 → [ibs-fire-module](https://github.com/Udeng96/ibs-fire-module) · [gasModule](https://github.com/Udeng96/gasModule) 참고

---

## 🔗 관련 저장소

- 🔥 [ibs-fire-module](https://github.com/Udeng96/ibs-fire-module) — 화재 이벤트 수집 모듈 (TCP)
- 💨 [gasModule](https://github.com/Udeng96/gasModule) — 가스 이벤트 수집 모듈 (DB polling)
- 🔆 불꽃 감지 모듈 _(추가 예정)_
