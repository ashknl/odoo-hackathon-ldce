CREATE TYPE "public"."trip_status" AS ENUM('UPCOMING', 'ONGOING', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."expense_category" AS ENUM('TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"profile_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"region" varchar(255),
	"description" text,
	"image" text,
	"cost_index" numeric(10, 2),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7)
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"cover_image" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"budget" numeric(12, 2),
	"status" "trip_status" DEFAULT 'UPCOMING' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"share_slug" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trips_share_slug_unique" UNIQUE("share_slug")
);
--> statement-breakpoint
CREATE TABLE "trip_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"position" integer NOT NULL,
	"budget" numeric(12, 2),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "planned_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_stop_id" uuid NOT NULL,
	"otm_place_id" varchar(255),
	"name" varchar(255) NOT NULL,
	"type" varchar(255),
	"image" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"date" date NOT NULL,
	"start_time" time,
	"end_time" time,
	"planned_cost" numeric(12, 2),
	"position" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "trip_expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"trip_stop_id" uuid,
	"category" "expense_category" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"expense_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "saved_destinations_user_city_unique" UNIQUE("user_id","city_id")
);
--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_activities" ADD CONSTRAINT "planned_activities_trip_stop_id_trip_stops_id_fk" FOREIGN KEY ("trip_stop_id") REFERENCES "public"."trip_stops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_trip_stop_id_trip_stops_id_fk" FOREIGN KEY ("trip_stop_id") REFERENCES "public"."trip_stops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cities_country_region_idx" ON "cities" USING btree ("country","region");--> statement-breakpoint
CREATE INDEX "trips_user_id_idx" ON "trips" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trip_stops_trip_position_idx" ON "trip_stops" USING btree ("trip_id","position");--> statement-breakpoint
CREATE INDEX "planned_activities_stop_date_idx" ON "planned_activities" USING btree ("trip_stop_id","date");--> statement-breakpoint
CREATE INDEX "planned_activities_otm_place_id_idx" ON "planned_activities" USING btree ("otm_place_id");--> statement-breakpoint
CREATE INDEX "trip_expenses_trip_id_idx" ON "trip_expenses" USING btree ("trip_id");