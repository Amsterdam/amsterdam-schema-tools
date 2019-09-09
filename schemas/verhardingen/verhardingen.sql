
CREATE TABLE prj_gisib.vhg_inspectie (
    vhg_id integer,
    inspectie_id character varying(200) NOT NULL,
    inspectiedatum character varying(200),
    crow_dwarsonvlakheid character varying(200),
    crow_oneffenheden character varying(200),
    crow_rafeling character varying(200),
    crow_randschade character varying(200),
    crow_scheurvorming character varying(200),
    crow_voegvulling character varying(200),
    crow_voegwijdte character varying(200),
    crow_zetting character varying(200),
    opmerking character varying(200)
);


ALTER TABLE prj_gisib.vhg_inspectie OWNER TO dataservice;

--
-- Name: vhg_object; Type: TABLE; Schema: prj_gisib; Owner: dataservice
--

CREATE TABLE prj_gisib.vhg_object (
    id bigint NOT NULL,
    aanleghoogte numeric(25,10),
    aanofvrijliggendom character varying(255),
    aanschafprijs numeric(25,10),
    aantaldocumenten bigint,
    kwaliteitsniveauactueel character varying(255),
    afmeting character varying(255),
    begingarantieperiode timestamp without time zone,
    typebeheerder character varying(255),
    typebeheerderplus character varying(255),
    beheergebied character varying(255),
    beheervak character varying(255),
    belasting character varying(255),
    bergendvermogen numeric(25,10),
    breedte numeric(25,10),
    constructie character varying(255),
    aantaldeklagen bigint,
    dikteconstructie numeric(25,10),
    draagkrachtig smallint,
    eindegarantieperiode timestamp without time zone,
    formaat character varying(255),
    adam_functie character varying(255),
    adam_functieplus character varying(255),
    typefundering character varying(255),
    gebruiksfunctie character varying(255),
    geluidsreducerend smallint,
    geometrie public.geometry(MultiPolygon,28992),
    kwaliteitsniveaugewenst character varying(255),
    grondsoort character varying(255),
    grondsoortplus character varying(255),
    imbor_identificatie character varying(40),
    bron_id bigint,
    identificatie character varying(255),
    jaarconserveren bigint,
    jaaruitgevoerdonderhoud bigint,
    jaarvanaanleg bigint,
    kleur character varying(255),
    mutatiedatum timestamp without time zone,
    lengte numeric(25,10),
    objecttype character varying(255),
    omtrek numeric(25,10),
    onderhoudsplichtige character varying(255),
    aantalonderlagen bigint,
    opleverdatum timestamp without time zone,
    oppervlaktegis numeric(25,10),
    status character varying(255),
    tussenlagen bigint,
    vhg_type character varying(255),
    vhg_typeplus2 character varying(255),
    vhg_typeplus character varying(255),
    typerijstrook character varying(255),
    objectbegintijd timestamp without time zone,
    objecteindtijd timestamp without time zone,
    waterdoorlatendheid character varying(255),
    wegfunctie character varying(255),
    wegtypebestaand character varying(255),
    zettingsgevoeligheid character varying(255),
    zettingsgevoeligheidplus character varying(255),
    buurt_id character varying(14),
    buurt_volledige_code character varying(4),
    buurt_naam character varying(40),
    beheergebied_id character varying(4),
    beheergebied_naam character varying(100),
    wijkcode character varying(3),
    wijknaam character varying(100),
    stadsdeel_code character varying(3),
    stadsdeel_naam character varying(40),
    gemeente_code character varying(4),
    gemeente_naam character varying(80),
    woonplaats_id character varying(16),
    woonplaatsnaam character varying(80),
    opr_id character varying(16),
    opr_naam character varying(150),
    opr_type text
);
