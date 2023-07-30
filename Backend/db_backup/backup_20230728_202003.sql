--
-- PostgreSQL database dump
--

-- Dumped from database version 12.15 (Ubuntu 12.15-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.15 (Ubuntu 12.15-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: actuator_type; Type: TYPE; Schema: public; Owner: home
--

CREATE TYPE public.actuator_type AS ENUM (
    'Light',
    'Lock',
    'Sensor'
);


ALTER TYPE public.actuator_type OWNER TO home;

--
-- Name: privacy_type; Type: TYPE; Schema: public; Owner: home
--

CREATE TYPE public.privacy_type AS ENUM (
    'private',
    'public'
);


ALTER TYPE public.privacy_type OWNER TO home;

--
-- Name: role_type; Type: TYPE; Schema: public; Owner: home
--

CREATE TYPE public.role_type AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.role_type OWNER TO home;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actuators; Type: TABLE; Schema: public; Owner: home
--

CREATE TABLE public.actuators (
    id integer NOT NULL,
    name character varying NOT NULL,
    pin integer NOT NULL,
    board_id integer NOT NULL,
    type public.actuator_type NOT NULL,
    state boolean
);


ALTER TABLE public.actuators OWNER TO home;

--
-- Name: actuators_id_seq; Type: SEQUENCE; Schema: public; Owner: home
--

CREATE SEQUENCE public.actuators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actuators_id_seq OWNER TO home;

--
-- Name: actuators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: home
--

ALTER SEQUENCE public.actuators_id_seq OWNED BY public.actuators.id;


--
-- Name: boards; Type: TABLE; Schema: public; Owner: home
--

CREATE TABLE public.boards (
    id integer NOT NULL,
    name character varying NOT NULL,
    privacy public.privacy_type NOT NULL
);


ALTER TABLE public.boards OWNER TO home;

--
-- Name: boards_id_seq; Type: SEQUENCE; Schema: public; Owner: home
--

CREATE SEQUENCE public.boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.boards_id_seq OWNER TO home;

--
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: home
--

ALTER SEQUENCE public.boards_id_seq OWNED BY public.boards.id;


--
-- Name: lock_actions; Type: TABLE; Schema: public; Owner: home
--

CREATE TABLE public.lock_actions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    actuator_id integer NOT NULL,
    board_id integer NOT NULL,
    state boolean NOT NULL,
    "time" timestamp without time zone
);


ALTER TABLE public.lock_actions OWNER TO home;

--
-- Name: lock_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: home
--

CREATE SEQUENCE public.lock_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lock_actions_id_seq OWNER TO home;

--
-- Name: lock_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: home
--

ALTER SEQUENCE public.lock_actions_id_seq OWNED BY public.lock_actions.id;


--
-- Name: user_auth; Type: TABLE; Schema: public; Owner: home
--

CREATE TABLE public.user_auth (
    userhome_id integer NOT NULL,
    boards_id integer NOT NULL
);


ALTER TABLE public.user_auth OWNER TO home;

--
-- Name: user_home; Type: TABLE; Schema: public; Owner: home
--

CREATE TABLE public.user_home (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying,
    role public.role_type NOT NULL
);


ALTER TABLE public.user_home OWNER TO home;

--
-- Name: user_home_id_seq; Type: SEQUENCE; Schema: public; Owner: home
--

CREATE SEQUENCE public.user_home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_home_id_seq OWNER TO home;

--
-- Name: user_home_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: home
--

ALTER SEQUENCE public.user_home_id_seq OWNED BY public.user_home.id;


--
-- Name: actuators id; Type: DEFAULT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.actuators ALTER COLUMN id SET DEFAULT nextval('public.actuators_id_seq'::regclass);


--
-- Name: boards id; Type: DEFAULT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.boards ALTER COLUMN id SET DEFAULT nextval('public.boards_id_seq'::regclass);


--
-- Name: lock_actions id; Type: DEFAULT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.lock_actions ALTER COLUMN id SET DEFAULT nextval('public.lock_actions_id_seq'::regclass);


--
-- Name: user_home id; Type: DEFAULT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.user_home ALTER COLUMN id SET DEFAULT nextval('public.user_home_id_seq'::regclass);


--
-- Data for Name: actuators; Type: TABLE DATA; Schema: public; Owner: home
--

COPY public.actuators (id, name, pin, board_id, type, state) FROM stdin;
4	SHT21	5	1	Sensor	f
11	Balcony 	7	3	Light	f
12	Led Light	5	4	Light	f
13	Room3 Door	2	4	Lock	f
10	Main Room Light	4	3	Light	t
9	Room2 Door	2	3	Lock	t
2	Main Light	2	1	Light	f
3	Kitchen	3	1	Light	t
6	Room Light	2	2	Light	f
7	Bed Light	3	2	Light	f
5	Room Door	1	2	Lock	t
1	Main Door	1	1	Lock	f
\.


--
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: home
--

COPY public.boards (id, name, privacy) FROM stdin;
1	Living Room	public
2	Oliver Room	private
3	Anis Room	private
4	Felipe Room	private
\.


--
-- Data for Name: lock_actions; Type: TABLE DATA; Schema: public; Owner: home
--

COPY public.lock_actions (id, user_id, actuator_id, board_id, state, "time") FROM stdin;
1	2	1	1	t	2023-07-25 21:20:24.386802
2	2	1	1	f	2023-07-25 21:20:24.929646
3	2	10	3	t	2023-07-25 21:20:28.738361
4	2	2	1	t	2023-07-25 21:20:31.444171
5	2	9	3	t	2023-07-25 21:20:38.924747
6	3	1	1	t	2023-07-25 21:20:52.828933
7	3	1	1	f	2023-07-25 21:20:53.225257
8	3	5	2	t	2023-07-25 21:20:55.188256
9	3	2	1	f	2023-07-25 21:20:57.005478
10	3	3	1	t	2023-07-25 21:20:58.509761
11	3	6	2	t	2023-07-25 21:20:59.547003
12	3	6	2	f	2023-07-25 21:21:00.001194
13	3	7	2	t	2023-07-25 21:21:01.365456
14	3	7	2	f	2023-07-25 21:22:43.517297
15	3	1	1	t	2023-07-26 00:40:34.461903
16	3	5	2	f	2023-07-26 01:02:32.331563
17	3	5	2	t	2023-07-26 01:02:32.929329
18	3	1	1	f	2023-07-26 01:23:37.032422
\.


--
-- Data for Name: user_auth; Type: TABLE DATA; Schema: public; Owner: home
--

COPY public.user_auth (userhome_id, boards_id) FROM stdin;
1	1
2	1
3	1
4	1
3	2
2	3
4	4
\.


--
-- Data for Name: user_home; Type: TABLE DATA; Schema: public; Owner: home
--

COPY public.user_home (id, username, password, role) FROM stdin;
1	admin	pbkdf2:sha256:260000$9B8PvmY0tQyoXTJz$a1f311b1777eb8eb8100263d2558c6f5a17a58d7306e27c92b9898bb120ec4fb	admin
3	Oliver	pbkdf2:sha256:260000$C3l2F9dhmlb9lfMZ$ab2cd8c50c9ada1815bc61bb3c52929841f224653ad4b025476cc2a0ba9e1da5	admin
4	Felipe	pbkdf2:sha256:260000$BMU6NTP3IFkYSJnc$439f52e69bcd275590893c27530c26373f1e1378d05bc1efcf5305c46a906b9c	user
2	Anis	pbkdf2:sha256:260000$jJmqWtB4ycYtgVXa$e78ae7babea57f9a46bf691c76c4f1268a0f94c8ce1dd1e970e660be4e2483ee	user
\.


--
-- Name: actuators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: home
--

SELECT pg_catalog.setval('public.actuators_id_seq', 13, true);


--
-- Name: boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: home
--

SELECT pg_catalog.setval('public.boards_id_seq', 4, true);


--
-- Name: lock_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: home
--

SELECT pg_catalog.setval('public.lock_actions_id_seq', 18, true);


--
-- Name: user_home_id_seq; Type: SEQUENCE SET; Schema: public; Owner: home
--

SELECT pg_catalog.setval('public.user_home_id_seq', 9, true);


--
-- Name: actuators actuators_name_key; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.actuators
    ADD CONSTRAINT actuators_name_key UNIQUE (name);


--
-- Name: actuators actuators_pkey; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.actuators
    ADD CONSTRAINT actuators_pkey PRIMARY KEY (id);


--
-- Name: boards boards_name_key; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_name_key UNIQUE (name);


--
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- Name: lock_actions lock_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.lock_actions
    ADD CONSTRAINT lock_actions_pkey PRIMARY KEY (id);


--
-- Name: user_auth user_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.user_auth
    ADD CONSTRAINT user_auth_pkey PRIMARY KEY (userhome_id, boards_id);


--
-- Name: user_home user_home_pkey; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.user_home
    ADD CONSTRAINT user_home_pkey PRIMARY KEY (id);


--
-- Name: user_home user_home_username_key; Type: CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.user_home
    ADD CONSTRAINT user_home_username_key UNIQUE (username);


--
-- Name: actuators actuators_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.actuators
    ADD CONSTRAINT actuators_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id);


--
-- Name: user_auth user_auth_boards_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.user_auth
    ADD CONSTRAINT user_auth_boards_id_fkey FOREIGN KEY (boards_id) REFERENCES public.boards(id);


--
-- Name: user_auth user_auth_userhome_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: home
--

ALTER TABLE ONLY public.user_auth
    ADD CONSTRAINT user_auth_userhome_id_fkey FOREIGN KEY (userhome_id) REFERENCES public.user_home(id);


--
-- PostgreSQL database dump complete
--

