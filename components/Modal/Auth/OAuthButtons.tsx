import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { getURL } from "../../../utils/helpers";
import { supabase } from "../../../utils/supabaseClient";
import { useSupaUser } from "../../../utils/useSupaUser";

const OAuthButtons: React.FC = () => {
  const [loading, setLoading] = useState<boolean>();
  const { googleLogin, error } = useSupaUser();

  const signInWithGoogle = async () => {
    setLoading(true);

    googleLogin();

    setLoading(false);
  };

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image src="/images/googlelogo.png" height="26px" mr={4} />
        Continue with Google
      </Button>
      {error && <Text>{error}</Text>}
    </Flex>
  );
};

export default OAuthButtons;
