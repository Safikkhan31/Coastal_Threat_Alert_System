package com.messege_manager;

import com.messege_manager.messenger.messenger;
import org.junit.Test;

public class AppTest{

    // @Test
    public void test_message(){
        messenger messenger = new messenger();
        messenger.sendAll("hi", "LOC001");
    }

    @Test
    public void test_main(){
        // Main m = new Main();
        // m.routine();
        Main.main(null);
    }
}