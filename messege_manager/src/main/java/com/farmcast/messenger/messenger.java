package com.farmcast.messenger;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import io.github.cdimascio.dotenv.Dotenv;
import java.sql.*;
import com.mysql.cj.jdbc.Driver;
import com.google.gson.*;

import io.github.cdimascio.dotenv.Dotenv;

public class messenger {

    Dotenv dotenv = Dotenv.load();
    String ACCOUNT_SID = dotenv.get("ACCOUNT_SID");
    String AUTH_TOKEN = dotenv.get("AUTH_TOKEN");
    String twilio_number = dotenv.get("NUMBER");
    String twilio_number_sms = dotenv.get("NUMBER_SMS");

    public void send(String phone_no, String messege){

        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        try{

            Message message = Message.creator(
                    new PhoneNumber("whatsapp:"+phone_no), // must be verified
                    new PhoneNumber("whatsapp:"+twilio_number),         // Twilio sandbox number
                    messege
            ).create();

            
            System.out.println("Message sent! SID: " + message.getSid() + "\n");

        } catch (final ApiException e) {
            System.err.println(e + "\n");
        }
    }

    public void sendSMS(String phone_no, String messege){

        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        try{

            Message message = Message.creator(
                    new PhoneNumber(phone_no), // must be verified
                    new PhoneNumber(twilio_number_sms),         // Twilio sandbox number
                    messege
            ).create();

            
            System.out.println("Message sent! SID: " + message.getSid() + "\n");

        } catch (final ApiException e) {
            System.err.println(e + "\n");
        }
    }

    public void sendAll(String messege, String location_id){
        Dotenv dotenv = Dotenv.load();

        String url = dotenv.get("url");
        String user = dotenv.get("user");
        String password = dotenv.get("password");

        try{
            DriverManager.registerDriver(new Driver());

            Connection con = DriverManager.getConnection(url, user, password);

            Statement sat = con.createStatement();

            ResultSet result = sat.executeQuery("Select location_id, phone_number from location_phones");

            while(result.next()){
                if(result.getString("location_id").equals(location_id)){
                    send(result.getString("phone_number").replaceAll("[^0-9+]", ""), messege);
                    sendSMS(result.getString("phone_number").replaceAll("[^0-9+]", ""), messege);
                }
            }
        }
        catch(SQLException e){
            e.printStackTrace();
        }
    }
}
