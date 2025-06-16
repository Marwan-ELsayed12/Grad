--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

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
-- Name: deliverymethod; Type: TYPE; Schema: public; Owner: iqraa_user
--

CREATE TYPE public.deliverymethod AS ENUM (
    'STANDARD_SHIPPING',
    'EXPRESS_SHIPPING',
    'PICKUP',
    'LOCAL_DELIVERY'
);


ALTER TYPE public.deliverymethod OWNER TO iqraa_user;

--
-- Name: orderstatus; Type: TYPE; Schema: public; Owner: iqraa_user
--

CREATE TYPE public.orderstatus AS ENUM (
    'PENDING',
    'BORROWED',
    'PURCHASED',
    'RETURNED',
    'CANCELLED'
);


ALTER TYPE public.orderstatus OWNER TO iqraa_user;

--
-- Name: transactionstatus; Type: TYPE; Schema: public; Owner: iqraa_user
--

CREATE TYPE public.transactionstatus AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'RETURNED',
    'CANCELLED'
);


ALTER TYPE public.transactionstatus OWNER TO iqraa_user;

--
-- Name: transactiontype; Type: TYPE; Schema: public; Owner: iqraa_user
--

CREATE TYPE public.transactiontype AS ENUM (
    'BORROW',
    'BUY'
);


ALTER TYPE public.transactiontype OWNER TO iqraa_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: book_category; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.book_category (
    book_id integer,
    category_id integer
);


ALTER TABLE public.book_category OWNER TO iqraa_user;

--
-- Name: book_reviews; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.book_reviews (
    review_id integer NOT NULL,
    book_id integer,
    user_id integer,
    rating numeric(2,1),
    review_text text,
    review_date timestamp with time zone DEFAULT now(),
    helpful_votes integer,
    verified_purchase boolean,
    source character varying(50),
    external_review_id character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.book_reviews OWNER TO iqraa_user;

--
-- Name: book_reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.book_reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.book_reviews_review_id_seq OWNER TO iqraa_user;

--
-- Name: book_reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.book_reviews_review_id_seq OWNED BY public.book_reviews.review_id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    isbn character varying(13),
    title character varying(255),
    author character varying(100),
    publisher character varying(100),
    publication_year integer,
    price numeric(10,2),
    stock_quantity integer,
    available_for_borrow boolean,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.books OWNER TO iqraa_user;

--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.books_book_id_seq OWNER TO iqraa_user;

--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100),
    description text,
    parent_id integer
);


ALTER TABLE public.categories OWNER TO iqraa_user;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO iqraa_user;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying(150),
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.groups OWNER TO iqraa_user;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_id_seq OWNER TO iqraa_user;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: model_data; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.model_data (
    id integer NOT NULL,
    name character varying(100),
    version integer,
    data json,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.model_data OWNER TO iqraa_user;

--
-- Name: model_data_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.model_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.model_data_id_seq OWNER TO iqraa_user;

--
-- Name: model_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.model_data_id_seq OWNED BY public.model_data.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    book_id integer,
    date_ordered timestamp with time zone DEFAULT now(),
    status public.orderstatus,
    is_borrowed boolean,
    is_purchased boolean,
    borrow_date timestamp with time zone,
    return_due_date timestamp with time zone,
    return_date timestamp with time zone,
    purchase_date timestamp with time zone
);


ALTER TABLE public.orders OWNER TO iqraa_user;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO iqraa_user;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(100),
    description text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.permissions OWNER TO iqraa_user;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO iqraa_user;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: recommendation_books; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.recommendation_books (
    recommendation_id integer,
    book_id integer
);


ALTER TABLE public.recommendation_books OWNER TO iqraa_user;

--
-- Name: recommendation_items; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.recommendation_items (
    item_id integer NOT NULL,
    recommendation_id integer,
    book_id integer,
    relevance_score double precision,
    "position" integer,
    reason text
);


ALTER TABLE public.recommendation_items OWNER TO iqraa_user;

--
-- Name: recommendation_items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.recommendation_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendation_items_item_id_seq OWNER TO iqraa_user;

--
-- Name: recommendation_items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.recommendation_items_item_id_seq OWNED BY public.recommendation_items.item_id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.recommendations (
    recommendation_id integer NOT NULL,
    user_id integer,
    date_generated timestamp with time zone DEFAULT now(),
    recommendation_type character varying(20),
    is_active boolean,
    source_book_id integer
);


ALTER TABLE public.recommendations OWNER TO iqraa_user;

--
-- Name: recommendations_recommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.recommendations_recommendation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendations_recommendation_id_seq OWNER TO iqraa_user;

--
-- Name: recommendations_recommendation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.recommendations_recommendation_id_seq OWNED BY public.recommendations.recommendation_id;


--
-- Name: review_helpful_votes; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.review_helpful_votes (
    vote_id integer NOT NULL,
    review_id integer,
    user_id integer,
    is_helpful boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.review_helpful_votes OWNER TO iqraa_user;

--
-- Name: review_helpful_votes_vote_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.review_helpful_votes_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_helpful_votes_vote_id_seq OWNER TO iqraa_user;

--
-- Name: review_helpful_votes_vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.review_helpful_votes_vote_id_seq OWNED BY public.review_helpful_votes.vote_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    book_id integer,
    rating integer,
    comment text,
    date_reviewed timestamp with time zone DEFAULT now()
);


ALTER TABLE public.reviews OWNER TO iqraa_user;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO iqraa_user;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: transaction_items; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.transaction_items (
    item_id integer NOT NULL,
    transaction_id integer,
    book_id integer,
    quantity integer,
    unit_price numeric(10,2),
    borrow_duration_days integer,
    return_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.transaction_items OWNER TO iqraa_user;

--
-- Name: transaction_items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.transaction_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_items_item_id_seq OWNER TO iqraa_user;

--
-- Name: transaction_items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.transaction_items_item_id_seq OWNED BY public.transaction_items.item_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    user_id integer,
    transaction_type public.transactiontype,
    status public.transactionstatus,
    total_amount numeric(10,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    estimated_delivery_time timestamp with time zone,
    actual_delivery_time timestamp with time zone,
    delivery_method public.deliverymethod,
    delivery_address text,
    notes text
);


ALTER TABLE public.transactions OWNER TO iqraa_user;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_transaction_id_seq OWNER TO iqraa_user;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.user_activities (
    id integer NOT NULL,
    user_id integer,
    book_id integer,
    view_count integer,
    last_viewed timestamp with time zone DEFAULT now(),
    is_favorite boolean,
    interaction_score double precision
);


ALTER TABLE public.user_activities OWNER TO iqraa_user;

--
-- Name: user_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.user_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_activities_id_seq OWNER TO iqraa_user;

--
-- Name: user_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.user_activities_id_seq OWNED BY public.user_activities.id;


--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.user_groups (
    user_id integer,
    group_id integer
);


ALTER TABLE public.user_groups OWNER TO iqraa_user;

--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.user_permissions (
    user_id integer,
    permission_id integer
);


ALTER TABLE public.user_permissions OWNER TO iqraa_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: iqraa_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50),
    email character varying(255),
    full_name character varying(100),
    password_hash character varying(255),
    is_admin boolean,
    is_staff boolean,
    is_superuser boolean,
    is_active boolean,
    address text,
    phone_number character varying(20),
    profile_picture character varying(255),
    bio text,
    birth_date date,
    favorite_genres json,
    notification_preferences json,
    is_verified boolean,
    last_active timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO iqraa_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: iqraa_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO iqraa_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqraa_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: book_reviews review_id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.book_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.book_reviews_review_id_seq'::regclass);


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: model_data id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.model_data ALTER COLUMN id SET DEFAULT nextval('public.model_data_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: recommendation_items item_id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendation_items ALTER COLUMN item_id SET DEFAULT nextval('public.recommendation_items_item_id_seq'::regclass);


--
-- Name: recommendations recommendation_id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN recommendation_id SET DEFAULT nextval('public.recommendations_recommendation_id_seq'::regclass);


--
-- Name: review_helpful_votes vote_id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.review_helpful_votes ALTER COLUMN vote_id SET DEFAULT nextval('public.review_helpful_votes_vote_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: transaction_items item_id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.transaction_items ALTER COLUMN item_id SET DEFAULT nextval('public.transaction_items_item_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Name: user_activities id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_activities ALTER COLUMN id SET DEFAULT nextval('public.user_activities_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: book_category; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.book_category (book_id, category_id) FROM stdin;
\.


--
-- Data for Name: book_reviews; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.book_reviews (review_id, book_id, user_id, rating, review_text, review_date, helpful_votes, verified_purchase, source, external_review_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.books (book_id, isbn, title, author, publisher, publication_year, price, stock_quantity, available_for_borrow, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.categories (id, name, description, parent_id) FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.groups (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: model_data; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.model_data (id, name, version, data, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.orders (id, user_id, book_id, date_ordered, status, is_borrowed, is_purchased, borrow_date, return_due_date, return_date, purchase_date) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.permissions (id, name, description, created_at) FROM stdin;
\.


--
-- Data for Name: recommendation_books; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.recommendation_books (recommendation_id, book_id) FROM stdin;
\.


--
-- Data for Name: recommendation_items; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.recommendation_items (item_id, recommendation_id, book_id, relevance_score, "position", reason) FROM stdin;
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.recommendations (recommendation_id, user_id, date_generated, recommendation_type, is_active, source_book_id) FROM stdin;
\.


--
-- Data for Name: review_helpful_votes; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.review_helpful_votes (vote_id, review_id, user_id, is_helpful, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.reviews (id, user_id, book_id, rating, comment, date_reviewed) FROM stdin;
\.


--
-- Data for Name: transaction_items; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.transaction_items (item_id, transaction_id, book_id, quantity, unit_price, borrow_duration_days, return_date, created_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.transactions (transaction_id, user_id, transaction_type, status, total_amount, created_at, updated_at, estimated_delivery_time, actual_delivery_time, delivery_method, delivery_address, notes) FROM stdin;
\.


--
-- Data for Name: user_activities; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.user_activities (id, user_id, book_id, view_count, last_viewed, is_favorite, interaction_score) FROM stdin;
\.


--
-- Data for Name: user_groups; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.user_groups (user_id, group_id) FROM stdin;
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.user_permissions (user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: iqraa_user
--

COPY public.users (id, username, email, full_name, password_hash, is_admin, is_staff, is_superuser, is_active, address, phone_number, profile_picture, bio, birth_date, favorite_genres, notification_preferences, is_verified, last_active, created_at, updated_at) FROM stdin;
\.


--
-- Name: book_reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.book_reviews_review_id_seq', 1, false);


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.books_book_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.groups_id_seq', 1, false);


--
-- Name: model_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.model_data_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: recommendation_items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.recommendation_items_item_id_seq', 1, false);


--
-- Name: recommendations_recommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.recommendations_recommendation_id_seq', 1, false);


--
-- Name: review_helpful_votes_vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.review_helpful_votes_vote_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: transaction_items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.transaction_items_item_id_seq', 1, false);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 1, false);


--
-- Name: user_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.user_activities_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqraa_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: book_reviews book_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.book_reviews
    ADD CONSTRAINT book_reviews_pkey PRIMARY KEY (review_id);


--
-- Name: books books_isbn_key; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: groups groups_name_key; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_name_key UNIQUE (name);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: model_data model_data_name_key; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.model_data
    ADD CONSTRAINT model_data_name_key UNIQUE (name);


--
-- Name: model_data model_data_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.model_data
    ADD CONSTRAINT model_data_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: recommendation_items recommendation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendation_items
    ADD CONSTRAINT recommendation_items_pkey PRIMARY KEY (item_id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (recommendation_id);


--
-- Name: review_helpful_votes review_helpful_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_pkey PRIMARY KEY (vote_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: transaction_items transaction_items_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_pkey PRIMARY KEY (item_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_book_reviews_review_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_book_reviews_review_id ON public.book_reviews USING btree (review_id);


--
-- Name: ix_books_book_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_books_book_id ON public.books USING btree (book_id);


--
-- Name: ix_books_title; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_books_title ON public.books USING btree (title);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_categories_name; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE UNIQUE INDEX ix_categories_name ON public.categories USING btree (name);


--
-- Name: ix_groups_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_groups_id ON public.groups USING btree (id);


--
-- Name: ix_model_data_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_model_data_id ON public.model_data USING btree (id);


--
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- Name: ix_permissions_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_permissions_id ON public.permissions USING btree (id);


--
-- Name: ix_recommendation_items_item_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_recommendation_items_item_id ON public.recommendation_items USING btree (item_id);


--
-- Name: ix_recommendations_recommendation_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_recommendations_recommendation_id ON public.recommendations USING btree (recommendation_id);


--
-- Name: ix_review_helpful_votes_vote_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_review_helpful_votes_vote_id ON public.review_helpful_votes USING btree (vote_id);


--
-- Name: ix_reviews_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_reviews_id ON public.reviews USING btree (id);


--
-- Name: ix_transaction_items_item_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_transaction_items_item_id ON public.transaction_items USING btree (item_id);


--
-- Name: ix_transactions_transaction_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_transactions_transaction_id ON public.transactions USING btree (transaction_id);


--
-- Name: ix_user_activities_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_user_activities_id ON public.user_activities USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: iqraa_user
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: book_category book_category_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.book_category
    ADD CONSTRAINT book_category_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: book_category book_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.book_category
    ADD CONSTRAINT book_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: book_reviews book_reviews_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.book_reviews
    ADD CONSTRAINT book_reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: book_reviews book_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.book_reviews
    ADD CONSTRAINT book_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: orders orders_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recommendation_books recommendation_books_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendation_books
    ADD CONSTRAINT recommendation_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: recommendation_books recommendation_books_recommendation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendation_books
    ADD CONSTRAINT recommendation_books_recommendation_id_fkey FOREIGN KEY (recommendation_id) REFERENCES public.recommendations(recommendation_id) ON DELETE CASCADE;


--
-- Name: recommendation_items recommendation_items_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendation_items
    ADD CONSTRAINT recommendation_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: recommendation_items recommendation_items_recommendation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendation_items
    ADD CONSTRAINT recommendation_items_recommendation_id_fkey FOREIGN KEY (recommendation_id) REFERENCES public.recommendations(recommendation_id) ON DELETE CASCADE;


--
-- Name: recommendations recommendations_source_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_source_book_id_fkey FOREIGN KEY (source_book_id) REFERENCES public.books(book_id) ON DELETE SET NULL;


--
-- Name: recommendations recommendations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_helpful_votes review_helpful_votes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.book_reviews(review_id) ON DELETE CASCADE;


--
-- Name: review_helpful_votes review_helpful_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transaction_items transaction_items_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: transaction_items transaction_items_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_activities user_activities_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: user_activities user_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_permissions user_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqraa_user
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

