document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', async () => {
        const goalId = checkbox.getAttribute('data-goal-id');
        await fetch('/toggle-goal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ goalId }),
        });
      });
    });
  });
  