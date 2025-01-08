import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useCustomNavigate = (fallbackPath = "/") => {
  const navigate = useNavigate();

  const goBackOrNavigate = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  }, [navigate, fallbackPath]);

  return goBackOrNavigate;
};
