--
-- PostgreSQL database dump
--

\restrict xJFK9sYMDQjxFyLVgBHZJWDQ8YTlYjEkqyYEN6dqECKV9Wco7iiubMI5zqwhb9T

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: appuser
--

INSERT INTO public.todos (id, title, done) VALUES (8, '本番DBに書き込む', false);
INSERT INTO public.todos (id, title, done) VALUES (9, '復元前に作ったtodo', false);
INSERT INTO public.todos (id, title, done) VALUES (10, '復元前に作ったtodo', false);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: appuser
--

SELECT pg_catalog.setval('public.todos_id_seq', 42, true);


--
-- PostgreSQL database dump complete
--

\unrestrict xJFK9sYMDQjxFyLVgBHZJWDQ8YTlYjEkqyYEN6dqECKV9Wco7iiubMI5zqwhb9T

