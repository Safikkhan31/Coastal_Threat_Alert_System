package com.messege;

import java.time.LocalTime;
import java.time.Duration;
import io.github.cdimascio.dotenv.Dotenv;
import java.sql.*;
import com.mysql.cj.jdbc.Driver;
import com.google.gson.*;
import com.messege.messenger.messenger;

public class Main {
    public static void main(String[] args) {
        // boolean done = false;
        // LocalTime routine_time = LocalTime.of(5,0);

        // while(true){
        //     if(!done && ( (int) Duration.between(routine_time, LocalTime.now()).toMinutes() > 0)){
        //         routine();
        //         done = true;
        //     }
        //     if(done && ((int) Duration.between(LocalTime.of(0,0), LocalTime.now()).toMinutes() > 0) && ((int) Duration.between(routine_time, LocalTime.now()).toMinutes() < 0)){
        //         done = false;
        //     }
        // }

        routine();
    }

    public static void routine(){
        System.out.println(".......................................routine started.........................................");
        Dotenv dotenv = Dotenv.load();

        String url = dotenv.get("url");
        String user = dotenv.get("user");
        String password = dotenv.get("password");
        

        try{
            DriverManager.registerDriver(new Driver());
        
            Connection con = DriverManager.getConnection(url, user, password);

            Statement sat = con.createStatement();

            ResultSet result = sat.executeQuery("Select location_id, dumping_quantity, saffir_simpson_category, sea_level_rise, bloom_risk_score, risk_score from ml_data");

            messenger messenger = new messenger();

            while(result.next()){

                float dumping = result.getFloat("dumping_quantity");
                int cylone = result.getInt("saffir_simpson_category");
                float sea_level_rise = result.getFloat("sea_level_rise");
                float bloom_risk_score = result.getFloat("bloom_risk_score");

                // for illegal dumping
                if(dumping > 50 && dumping < 200){
                    messenger.sendAll("Sea level rise exceeds safe threshold. Blue carbon ecosystems under stress, long-term coastal planning required", result.getString("location_id"));
                }
                else if(dumping > 200){
                    messenger.sendAll("Rapid sea level rise detected. Risk of mangrove drowning and soil carbon loss. Authorities must initiate coastal defense and monitoring.", result.getString("location_id"));
                }

                // for algai bloom
                if(bloom_risk_score < 20){
                    messenger.sendAll("Algal levels too low. Risk of reduced food availability for fish larvae. Authorities should monitor ecosystem balance.", result.getString("location_id"));
                }
                else if(bloom_risk_score > 50 && bloom_risk_score < 75){
                    messenger.sendAll("High algal bloom risk detected. Fishermen advised to avoid fishing in affected areas due to oxygen depletion risk.", result.getString("location_id"));
                }
                else if(bloom_risk_score > 75){
                    messenger.sendAll("Severe algal bloom risk detected. Immediate stop on fishing recommended. Authorities should monitor water quality and issue safety warnings.", result.getString("location_id"));
                }

                // for storm
                if(cylone >= 1 && cylone <= 2){
                    messenger.sendAll("Cyclone detected (Category 1–2). Coastal erosion and wave surges may weaken blue carbon ecosystems. Prepare precautionary measures.", result.getString("location_id"));
                }
                else if(cylone >= 3){
                    messenger.sendAll("Severe Cyclone (Category 3–5) expected. High risk to mangroves, seagrass, and coastal wetlands. Immediate evacuation and disaster response required.", result.getString("location_id"));
                }

                // for sea level
                if(sea_level_rise > 5 && sea_level_rise < 20){
                    messenger.sendAll("Sea level rise exceeds safe threshold. Blue carbon ecosystems under stress, long-term coastal planning required.", result.getString("location_id"));
                } 
                else if(sea_level_rise > 20){
                    messenger.sendAll("Rapid sea level rise detected. Risk of mangrove drowning and soil carbon loss. Authorities must initiate coastal defense and monitoring.", result.getString("location_id"));
                }

            }

        }catch(SQLException e){
            e.printStackTrace();
        }


        System.out.println("........................................rountine ended ............................................\n");
    }
}